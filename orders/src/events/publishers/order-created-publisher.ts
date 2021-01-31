import { Publisher, OrderCreatedEvent, Subjects } from "@nlazzos/gittix-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
