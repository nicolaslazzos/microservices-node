import express from "express";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

// to trust the nginx proxy
app.set("trust proxy", true);

// middleware
app.use(express.json({ extended: false } as any));

// signed: false => not encrypted
// secure: true => only works in a https connection
app.use(cookieSession({ signed: false, secure: true }));

// routing
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// not handled routes
app.all("*", () => {
  throw new NotFoundError();
});

// error handling
app.use(errorHandler);

export { app };
