import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@nlazzos/gittix-common";

import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, price } = req.body;

      res.send({});
    } catch (e) {
      next(e);
    }
  }
);

export { router as deleteOrderRouter };
