import { Publisher, PaymentCreatedEvent, Subjects } from "@nlazzos/gittix-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
