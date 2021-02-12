import mongoose from "mongoose";
import request from "supertest";

import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";
import { app } from "../../app";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns an error if the order does not exist", async () => {
  const orderId = mongoose.Types.ObjectId();
  const cookie = global.signin();

  await request(app).post("/api/payments").set("Cookie", cookie).send({ orderId, token: "atesttoken" }).expect(404);
});

it("emits an unauthorized error if the user doesnt own the order", async () => {
  const cookie = global.signin();

  const order = new Order({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.AwaitingPayment,
    userId: new mongoose.Types.ObjectId().toHexString(),
    __v: 0
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: order.id, token: "atesttoken" })
    .expect(401);
});

it("emits a bad request error if the order is cancelled", async () => {
  const order = new Order({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId: new mongoose.Types.ObjectId().toHexString(),
    __v: 0
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({ orderId: order.id, token: "atesttoken" })
    .expect(400);
});

it("returns a status created then valid inputs", async () => {
  const order = new Order({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    __v: 0
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({ orderId: order.id, token: "tok_visa" })
    .expect(201);

  const charge = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(charge.source).toEqual("tok_visa");
  expect(charge.currency).toEqual("usd");
  expect(charge.amount).toEqual(order.price * 100);

  const payment = await Payment.findOne({ orderId: order.id });

  expect(payment).not.toBeNull();
});
