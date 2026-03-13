import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate";
import { registerDonorSchema, registerHospitalSchema, loginSchema } from "./auth.schema";

const router = Router();

// POST /api/auth/register/donor
router.post("/register/donor", validate(registerDonorSchema), authController.registerDonor);

// POST /api/auth/register/hospital
router.post("/register/hospital", validate(registerHospitalSchema), authController.registerHospital);

// POST /api/auth/login
router.post("/login", validate(loginSchema), authController.login);

export default router;