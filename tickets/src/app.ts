import express from "express";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@nlazzos/gittix-common";

const app = express();

// to trust the nginx proxy
app.set("trust proxy", true);

// middleware
app.use(express.json({ extended: false } as any));

// signed: false => not encrypted
// secure: true => only works in a https connection
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

// routing

// not handled routes
app.all("*", () => {
  throw new NotFoundError();
});

// error handling
app.use(errorHandler);

export { app };
