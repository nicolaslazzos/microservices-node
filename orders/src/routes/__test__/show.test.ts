import request from "supertest";

import { Ticket } from "../../models/ticket";
import { app } from "../../app";

it("fetches the order", async () => {
  const cookie = global.signin();

  const ticket = new Ticket({ title: "A test ticket", price: 20 });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});

it("returns an error if tries to fetch another user order", async () => {
  const ticket = new Ticket({ title: "A test ticket", price: 20 });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
