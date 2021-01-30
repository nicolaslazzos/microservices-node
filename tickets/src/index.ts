import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("Environment variable JWT_KEY not found");

  if (!process.env.MONGO_URI)
    throw new Error("Environment variable MONGO_URI not found");

  try {
    await natsWrapper.connect("ticketing", "clientid", "http://nats-serv:4222");

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");

      // exits the entire program
      process.exit();
    });

    // handling interrupts or terminates to close the connection properly so the next time we connect,
    // we will get the unprocessed events, otherwise, nats will think that the service is not going to connect again
    // to test that we can delete the nats-depl pod
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
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
