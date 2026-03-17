import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as donorController from "./donor.controller";
import { validate } from "../../middleware/validate";
import { updateDonorSchema } from "./donor.schema";

/**
 * @swagger
 * /api/donors/me:
 *   get:
 *     summary: Get logged in donor's profile
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donor profile returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Donor not found
 *   patch:
 *     summary: Update logged in donor's profile
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               county:
 *                 type: string
 *               town:
 *                 type: string
 *               lastDonationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *
 * /api/donors:
 *   get:
 *     summary: Get all donors (hospital only)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of donors
 *       403:
 *         description: Forbidden
 *
 * /api/donors/blood-group/{bloodGroup}:
 *   get:
 *     summary: Get donors by blood group (hospital only)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bloodGroup
 *         required: true
 *         schema:
 *           type: string
 *           enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG]
 *     responses:
 *       200:
 *         description: List of matching donors
 *       403:
 *         description: Forbidden
 */

const router = Router();

// Donor: view and update own profile
router.get("/me", requireAuth, requireRole("DONOR"), donorController.getMyProfile);
router.patch("/me", requireAuth, requireRole("DONOR"), validate(updateDonorSchema), donorController.updateMyProfile);

// Hospital: view donors (for matching)
router.get("/", requireAuth, requireRole("HOSPITAL"), donorController.getAllDonors);
router.get("/blood-group/:bloodGroup", requireAuth, requireRole("HOSPITAL"), donorController.getDonorsByBloodGroup);

export default router;