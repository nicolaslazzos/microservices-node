import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@nlazzos/gittix-common";

import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  // if we have multiple copies of a service, the queue group name makes sure that an event will be sent only to one of these copies
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    try {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

      await expirationQueue.add({ orderId: data.id }, { delay });

      msg.ack();
    } catch (e) {
      console.error(e);
    }
  }
}
