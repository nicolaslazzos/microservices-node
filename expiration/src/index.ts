import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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
  } catch (e) {
    console.log("[start]", e);
  }
};

start();
