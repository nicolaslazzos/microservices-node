import request from "supertest";
import { app } from "../../app";

it("fails when signing in when an email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "nicolaslazzos@gmail.com", password: "password" })
    .expect(400);
});

it("fails when signing in when an incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "nicolaslazzos@gmail.com", password: "password" })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({ email: "nicolaslazzos@gmail.com", password: "pass" })
    .expect(400);
});

it("responds with a cookie when a successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "nicolaslazzos@gmail.com", password: "password" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "nicolaslazzos@gmail.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
