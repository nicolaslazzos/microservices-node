import express from "express";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

// middleware
app.use(express.json({ extended: false } as any));

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

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-serv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("[start]", e);
  }
  const PORT = process.env.PORT || 3000;

  app.listen(3000, () => console.log(`Running server on port ${PORT}`));
};

start();
