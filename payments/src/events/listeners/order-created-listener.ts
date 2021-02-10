import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@nlazzos/gittix-common";

import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    try {
      const {
        id,
        status,
        ticket: { price },
        userId,
        __v
      } = data;

      const order = new Order({ id, status, price, userId, __v });

      await order.save();

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
