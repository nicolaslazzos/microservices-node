import { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects } from "@nlazzos/gittix-common";

export class TicketCreatedListeter extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
