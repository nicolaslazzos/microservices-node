import {
  Publisher,
  TicketUpdatedEvent,
  Subjects,
} from "@nlazzos/gittix-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
