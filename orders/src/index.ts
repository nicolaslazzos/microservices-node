import { app } from "./app";
import mongoose from "mongoose";

import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("Environment variable JWT_KEY not found");

  if (!process.env.MONGO_URI) throw new Error("Environment variable MONGO_URI not found");

  if (!process.env.NATS_URL) throw new Error("Environment variable NATS_URL not found");

  if (!process.env.NATS_CLUSTER_ID) throw new Error("Environment variable NATS_CLUSTER_ID not found");

  if (!process.env.NATS_CLIENT_ID) throw new Error("Environment variable NATS_CLIENT_ID not found");

  try {
    // the clientId (second parameter) must be unique for every copy of the service (see deployment .yml file)

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

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

    // initializing events listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("[start]", e);
  }
  const PORT = process.env.PORT || 3000;

  app.listen(3000, () => console.log(`Running server on port ${PORT}`));
};

start();
