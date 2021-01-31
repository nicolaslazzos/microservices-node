import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@nlazzos/gittix-common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListeter extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    try {
      const { id, title, price } = data;

      const ticket = await Ticket.findById(id);

      if (!ticket) throw new Error("Ticket not found");

      ticket.set({ title, price });

      await ticket.save();

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
