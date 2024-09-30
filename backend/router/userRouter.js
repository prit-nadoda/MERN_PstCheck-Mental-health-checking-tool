import express from "express";
import passport from "passport";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import {
  addNewAdmin,
  addNewDoctor,
  addNewQuestion,
  forgotPassword,
  getAllDoctors,
  getAllQuestions,
  getUserInfo,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  processTestAndGenerateReport,
  resetPassword,
  verifyUser,
  getUserWithReports,
} from "../controllers/userController.js";
import { generateToken } from "../utils/jwkToken.js";
import { checkUserSubscription } from "../middlewares/monitorCredits.js";

const router = express.Router();
router.post("/patient/register", patientRegister);
router.get("/verify-email/:token", verifyUser);
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
router.get("/getAllQuestions", getAllQuestions);
router.post("/submit-assessment", isPatientAuthenticated, checkUserSubscription, processTestAndGenerateReport);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/admin/addNewDoctor", isAdminAuthenticated, addNewDoctor);
router.post("/admin/addNewQuestion", isAdminAuthenticated, addNewQuestion);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/getAllReports", isPatientAuthenticated, getUserWithReports);

export default router;
