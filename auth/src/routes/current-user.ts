import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res, next) => {
  if (!req.session?.jwt) return res.send({ user: null });

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ user: payload });
  } catch (e) {
    res.send({ user: null });
  }
});

export { router as currentUserRouter };
