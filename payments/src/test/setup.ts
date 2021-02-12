import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

let mongo: any;

// redirecting the nats-wrapper import to the mock when running tests
jest.mock("../nats-wrapper");

beforeAll(async () => {
  process.env.JWT_KEY = "verysecurekey";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  // clear all mocks so we dont have data from past tests before each one
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // faking a session for testing purpouses

  const payload = {
    id: id ?? new mongoose.Types.ObjectId().toHexString(),
    email: "nicolaslazzos@gmail.com"
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = Buffer.from(JSON.stringify({ jwt: token })).toString("base64");

  return [`express:sess=${session}`];
};
