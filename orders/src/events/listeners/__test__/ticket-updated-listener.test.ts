import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@nlazzos/gittix-common";

import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "A test title",
    price: 20
  });

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    __v: ticket.__v + 1,
    id: ticket._id,
    title: "An updated test title",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, ticket, msg };
};

it("finds, updated and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket._id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not acks the message if has a skipped version", async () => {
  const { listener, data, msg } = await setup();

  data.__v = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
