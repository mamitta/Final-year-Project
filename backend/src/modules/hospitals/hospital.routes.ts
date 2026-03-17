import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as hospitalController from "./hospital.controller";
import { validate } from "../../middleware/validate";
import { updateHospitalSchema } from "./hospital.schema";

/**
 * @swagger
 * /api/hospitals/me:
 *   get:
 *     summary: Get logged in hospital's profile
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital profile returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital not found
 *   patch:
 *     summary: Update logged in hospital's profile
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               county:
 *                 type: string
 *               town:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hospitals
 *       401:
 *         description: Unauthorized
 */

const router = Router();

// Hospital: view and update own profile
router.get("/me", requireAuth, requireRole("HOSPITAL"), hospitalController.getMyProfile);
router.patch("/me", requireAuth, requireRole("HOSPITAL"), validate(updateHospitalSchema), hospitalController.updateMyProfile);

// Public: list all hospitals
router.get("/", requireAuth, hospitalController.getAllHospitals);

export default router;