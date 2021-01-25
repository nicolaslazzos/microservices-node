import express from "express";
import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@nlazzos/gittix-common";
import { newTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

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
app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// not handled routes
app.all("*", () => {
  throw new NotFoundError();
});

// error handling
app.use(errorHandler);

export { app };
