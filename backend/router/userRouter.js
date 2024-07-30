import express from "express";
import passport from "passport";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import {
  addNewAdmin,
  addNewDoctor,
  forgotPassword,
  getAllDoctors,
  getUserInfo,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  resetPassword,
} from "../controllers/userController.js";
import { generateToken } from "../utils/jwkToken.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.post("/admin/addNewAdmin", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserInfo);
router.get("/patient/me", isPatientAuthenticated, getUserInfo);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/admin/addNewDoctor", isAdminAuthenticated, addNewDoctor);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
