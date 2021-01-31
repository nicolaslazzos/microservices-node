import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@nlazzos/gittix-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
