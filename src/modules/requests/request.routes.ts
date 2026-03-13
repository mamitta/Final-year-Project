import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as requestController from "./request.controller";
import { validate } from "../../middleware/validate";
import { createRequestSchema, updateRequestStatusSchema } from "./request.schema";

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all active donation requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active requests
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a donation request (hospital only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bloodGroup, unitsNeeded, county, town]
 *             properties:
 *               bloodGroup:
 *                 type: string
 *                 enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG]
 *               unitsNeeded:
 *                 type: integer
 *               county:
 *                 type: string
 *               town:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created
 *       403:
 *         description: Forbidden
 *
 * /api/requests/mine:
 *   get:
 *     summary: Get hospital's own requests (hospital only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hospital's requests
 *       403:
 *         description: Forbidden
 *
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Update request status (hospital only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, FULFILLED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Request not found
 */

const router = Router();

// Public (authenticated): view all active requests
router.get("/", requireAuth, requestController.getAllRequests);

// Hospital: manage own requests
router.post("/", requireAuth, requireRole("HOSPITAL"), validate(createRequestSchema), requestController.createRequest);
router.get("/mine", requireAuth, requireRole("HOSPITAL"), requestController.getMyRequests);
router.patch("/:id/status", requireAuth, requireRole("HOSPITAL"), validate(updateRequestStatusSchema), requestController.updateRequestStatus);

export default router;