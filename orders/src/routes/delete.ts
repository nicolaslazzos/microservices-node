import express, { Request, Response, NextFunction } from "express";
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
} from "@nlazzos/gittix-common";

import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const order = await Order.findById(id).populate("ticket");

      if (!order) throw new NotFoundError();

      if (order.userId !== req.user!.id) throw new NotAuthorizedError();

      order.status = OrderStatus.Cancelled;

      await order.save();

      res.status(204).send(order);
    } catch (e) {
      next(e);
    }
  }
);

export { router as deleteOrderRouter };
