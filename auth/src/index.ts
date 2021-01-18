import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("Environment variable JWT_KEY not found");

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
