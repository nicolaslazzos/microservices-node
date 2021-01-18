import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must enter a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) throw new BadRequestError("Invalid credentials");

      const passwordMatch = await Password.compare(user.password, password);

      if (!passwordMatch) throw new BadRequestError("Invalid credentials");

      const userJwt = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      req.session = { ...req.session, jwt: userJwt };

      res.status(200).send(user);
    } catch (e) {
      next(e);
    }
  }
);

export { router as signInRouter };
