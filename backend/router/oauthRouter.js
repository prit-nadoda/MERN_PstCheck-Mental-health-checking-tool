import express from "express";
import passport from "passport";
import { oAuthSetCookies } from "../utils/jwkToken.js";

const router = express.Router();

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/sign-up",
    session: false,
  }),
  (req, res) => {
    if (req.user) {
      const token = req.user.patientToken;
      const userType = req.user.type;

      oAuthSetCookies(res, token, userType);
      res.redirect("http://localhost:5173/");
    } else {
      res.redirect("http://localhost:5173/sign-up");
    }
  }
);

export default router;
