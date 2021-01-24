import express from "express";

import { currentUser } from "@nlazzos/gittix-common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res, next) => {
  res.send({ user: req.user ?? null });
});

export { router as currentUserRouter };
