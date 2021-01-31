import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@nlazzos/gittix-common";

import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("A valid ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;

      const ticket = await Ticket.findById(ticketId);

      if (!ticket) throw new NotFoundError();

      const reserved = await ticket.isReserved();

      if (reserved) throw new BadRequestError("The ticket is already reserved");

      const expiration = new Date();

      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      const order = new Order({
        status: OrderStatus.Created,
        userId: req.user!.id,
        expiresAt: expiration,
        ticket,
      });

      await order.save();

      res.status(201).send(order);
    } catch (e) {
      next(e);
    }
  }
);

export { router as newOrderRouter };
