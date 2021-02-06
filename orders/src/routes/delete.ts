import express, { Request, Response, NextFunction } from "express";
import { requireAuth, NotAuthorizedError, NotFoundError } from "@nlazzos/gittix-common";

import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.user!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      },
      __v: order.__v
    });

    res.status(204).send(order);
  } catch (e) {
    next(e);
  }
});

export { router as deleteOrderRouter };
