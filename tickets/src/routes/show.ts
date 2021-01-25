import express, { Request, Response, NextFunction } from "express";

import { Ticket } from "../models/ticket";
import { NotFoundError } from "@nlazzos/gittix-common";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findById(id);

      if (!ticket) throw new NotFoundError();

      res.status(200).send(ticket);
    } catch (e) {
      next(e);
    }
  }
);

export { router as showTicketRouter };
