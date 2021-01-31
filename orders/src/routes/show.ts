import express, { Request, Response, NextFunction } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
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

      const order = await Order.findById(id).populate("ticket");

      if (!order) throw new NotFoundError();

      if (order.userId !== req.user!.id) throw new NotAuthorizedError();

      res.status(200).send(order);
    } catch (e) {
      next(e);
    }
  }
);

export { router as showOrderRouter };
