import express from "express";
import {
    getCheckoutSession,
    getAllPlans
} from "../controllers/subscriptionController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/checkout-session/:subId", isPatientAuthenticated, getCheckoutSession);
router.get("/get-all", getAllPlans);

export default router;
