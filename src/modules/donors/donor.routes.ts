import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as donorController from "./donor.controller";

const router = Router();

// Donor: view and update own profile
router.get("/me", requireAuth, requireRole("DONOR"), donorController.getMyProfile);
router.patch("/me", requireAuth, requireRole("DONOR"), donorController.updateMyProfile);

// Hospital: view donors (for matching)
router.get("/", requireAuth, requireRole("HOSPITAL"), donorController.getAllDonors);
router.get("/blood-group/:bloodGroup", requireAuth, requireRole("HOSPITAL"), donorController.getDonorsByBloodGroup);

export default router;