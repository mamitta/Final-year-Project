import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as hospitalController from "./hospital.controller";

const router = Router();

// Hospital: view and update own profile
router.get("/me", requireAuth, requireRole("HOSPITAL"), hospitalController.getMyProfile);
router.patch("/me", requireAuth, requireRole("HOSPITAL"), hospitalController.updateMyProfile);

// Public: list all hospitals
router.get("/", requireAuth, hospitalController.getAllHospitals);

export default router;