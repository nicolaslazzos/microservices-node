import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@nlazzos/gittix-common";

import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({ userId: req.user!.id }).populate("ticket");

      res.status(200).send(orders);
    } catch (e) {
      next(e);
    }
  }
);

export { router as indexOrderRouter };
