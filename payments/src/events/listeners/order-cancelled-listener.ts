import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from "@nlazzos/gittix-common";

import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    try {
      const order = await Order.findByEvent(data);

      if (!order) throw new Error("Order not found");

      order.set({ status: OrderStatus.Cancelled });

      await order.save();

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
