import { Message } from "node-nats-streaming";
import { Listener, ExpirationCompleteEvent, Subjects } from "@nlazzos/gittix-common";

import { Order, OrderStatus } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    try {
      const { orderId } = data;

      const order = await Order.findById(orderId).populate("ticket");

      if (!order) throw new Error("Order not found");

      order.set({ status: OrderStatus.Cancelled });

      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        ticket: {
          id: order.ticket.id
        },
        __v: order.__v
      });

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
