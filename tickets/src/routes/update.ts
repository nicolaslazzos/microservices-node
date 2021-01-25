import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

import { Ticket } from "../models/ticket";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@nlazzos/gittix-common";

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

      res.status(200).send(ticket);
    } catch (e) {
      next(e);
    }
  }
);

export { router as updateTicketRouter };
