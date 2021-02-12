import { Message } from "node-nats-streaming";
import { Listener, PaymentCreatedEvent, Subjects } from "@nlazzos/gittix-common";

import { Order, OrderStatus } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    try {
      const { orderId } = data;

      const order = await Order.findById(orderId);

      if (!order) throw new Error("Order not found");

      order.set({ status: OrderStatus.Complete });

      await order.save();

      // then the order its not needed to be updated again when its complete, so its not necessary to emit an order updated event

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
