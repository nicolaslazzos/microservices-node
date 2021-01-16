import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError } from "../errors/request-validation-errors";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

      const { email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) throw new BadRequestError("Email in use");

      const user = new User({ email, password });

      await user.save();

      res.status(201).send(user);
    } catch (e) {
      next(e);
    }
  }
);

export { router as signUpRouter };
