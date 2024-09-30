import express from "express";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
import { getAlltransactions, getPaymentSuccessTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/get-succeed", isPatientAuthenticated, getPaymentSuccessTransaction);
router.get("/get-all", isPatientAuthenticated, getAlltransactions);

export default router;
