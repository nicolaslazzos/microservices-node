import mongoose from "mongoose";
import request from "supertest";

import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { app } from "../../app";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();
  const cookie = global.signin();

  await request(app).post("/api/orders").set("Cookie", cookie).send({ ticketId }).expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const cookie = global.signin();

  const ticket = new Ticket({ id: new mongoose.Types.ObjectId().toHexString(), title: "A test ticket", price: 20 });

  await ticket.save();

  const order = new Order({
    ticket,
    userId: "atestuserid",
    status: OrderStatus.Created,
    expiresAt: new Date()
  });

  await order.save();

  await request(app).post("/api/orders").set("Cookie", cookie).send({ ticketId: ticket.id }).expect(400);
});

it("reserves a ticket", async () => {
  const cookie = global.signin();

  const ticket = new Ticket({ id: new mongoose.Types.ObjectId().toHexString(), title: "A test ticket", price: 20 });

  await ticket.save();

  await request(app).post("/api/orders").set("Cookie", cookie).send({ ticketId: ticket.id }).expect(201);
});

it("emits an order created event", async () => {
  const cookie = global.signin();

  const ticket = new Ticket({ id: new mongoose.Types.ObjectId().toHexString(), title: "A test ticket", price: 20 });

  await ticket.save();

  await request(app).post("/api/orders").set("Cookie", cookie).send({ ticketId: ticket.id }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
