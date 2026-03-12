import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

// POST /api/auth/register/donor
router.post("/register/donor", authController.registerDonor);

// POST /api/auth/register/hospital
router.post("/register/hospital", authController.registerHospital);

// POST /api/auth/login
router.post("/login", authController.login);

export default router;