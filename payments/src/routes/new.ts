import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError
} from "@nlazzos/gittix-common";

import { stripe } from "../stripe";
import { Order, OrderStatus } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("A valid token must be provided"),
    body("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("A valid order id must be provided")
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, token } = req.body;

      const order = await Order.findById(orderId);

      if (!order) throw new NotFoundError();

      if (order.userId !== req.user!.id) throw new NotAuthorizedError();

      if (order.status === OrderStatus.Cancelled) throw new BadRequestError("The order is cancelled");

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token
      });

      const payment = new Payment({ orderId, paymentId: charge.id });

      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        paymentId: payment.paymentId
      });

      res.status(201).send(payment);
    } catch (e) {
      next(e);
    }
  }
);

export { router as newPaymentRouter };
