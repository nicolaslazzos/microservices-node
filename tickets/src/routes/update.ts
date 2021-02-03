import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@nlazzos/gittix-common";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title cannot be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, price } = req.body;
      const { id } = req.params;

      const ticket = await Ticket.findById(id);

      if (!ticket) throw new NotFoundError();

      if (ticket.userId !== req.user!.id) throw new NotAuthorizedError();

      ticket.set({ title, price });

      await ticket.save();

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        __v: ticket.__v,
      });

      res.status(200).send(ticket);
    } catch (e) {
      next(e);
    }
  }
);

export { router as updateTicketRouter };
