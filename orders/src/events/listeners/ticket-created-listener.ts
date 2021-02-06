import { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects } from "@nlazzos/gittix-common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    try {
      const { id, title, price } = data;

      const ticket = new Ticket({ id, title, price });

      await ticket.save();

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
