import express from "express";
import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@nlazzos/gittix-common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

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

app.use(currentUser);

// routing
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// not handled routes
app.all("*", () => {
  throw new NotFoundError();
});

// error handling
app.use(errorHandler);

export { app };
