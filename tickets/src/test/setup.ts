import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "verysecurekey";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // faking a session for testing purpouses

  const payload = {
    id: "gjhk87T9bk98yHJHKl",
    email: "nicolaslazzos@gmail.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = Buffer.from(JSON.stringify({ jwt: token })).toString(
    "base64"
  );

  return [`express:sess=${session}`];
};
