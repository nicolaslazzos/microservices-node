import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@nlazzos/gittix-common";

export class TicketUpdatedListeter extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
