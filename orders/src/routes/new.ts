import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@nlazzos/gittix-common";

import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

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
      const { title, price } = req.body;

      res.send({});
    } catch (e) {
      next(e);
    }
  }
);

export { router as newOrderRouter };
