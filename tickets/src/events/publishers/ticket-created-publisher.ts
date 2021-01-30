import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
} from "@nlazzos/gittix-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
