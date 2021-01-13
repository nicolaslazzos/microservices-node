import express from "express";

const app = express();

app.use(express.json({ extended: false } as any));

app.get("/api/users/currentUser", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log(`Running server on port ${PORT}`));
