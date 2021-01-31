import request from "supertest";

import { Ticket } from "../../models/ticket";
import { app } from "../../app";

const createTicket = async () => {
  const ticket = new Ticket({ title: "A test ticket", price: 20 });
  await ticket.save();
  return ticket;
};

it("returns a list of a particular user orders", async () => {
  const firstUser = global.signin();
  const secondUser = global.signin();

  const firstTicket = await createTicket();
  const secondTicket = await createTicket();
  const thirdTicket = await createTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id });

  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: secondTicket.id });

  const { body: secondOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: thirdTicket.id });

  const { body: orders } = await request(app)
    .get("/api/orders")
    .set("Cookie", secondUser)
    .expect(200);

  expect(orders.length).toEqual(2);
  expect(orders[0].id).toEqual(firstOrder.id);
  expect(orders[1].id).toEqual(secondOrder.id);
  expect(orders[0].ticket.id).toEqual(secondTicket.id);
  expect(orders[1].ticket.id).toEqual(thirdTicket.id);
});
