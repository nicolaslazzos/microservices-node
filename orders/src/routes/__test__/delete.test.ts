import request from "supertest";

import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { app } from "../../app";

it("deletes an order", async () => {
  const cookie = global.signin();

  const ticket = new Ticket({ title: "A test ticket", price: 20 });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");