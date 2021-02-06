import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@nlazzos/gittix-common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    try {
      const ticket = await Ticket.findById(data.ticket.id);

      if (!ticket) throw new Error("Ticket not found");

      ticket.set({ orderId: undefined });

      await ticket.save();

      // this.client is coming from the natsWrapper.client provided when initialized the listener
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: ticket.orderId,
        __v: ticket.__v
      });

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
