import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@nlazzos/gittix-common";

import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequestError("A valid ticket id must be provided");

      const order = await Order.findById(id).populate("ticket");

      if (!order) throw new NotFoundError();

      if (order.userId !== req.user!.id) throw new NotAuthorizedError();

      res.send(order);
    } catch (e) {
      next(e);
    }
  }
);

export { router as showOrderRouter };
