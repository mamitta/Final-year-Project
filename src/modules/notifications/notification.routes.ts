import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as notificationController from "./notification.controller";

/**
 * @swagger
 * /api/notifications/broadcast/{requestId}:
 *   post:
 *     summary: Broadcast SMS to eligible donors (hospital only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SMS broadcast result
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Request not found
 *
 * /api/notifications/mine:
 *   get:
 *     summary: Get donor's own notifications (donor only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       403:
 *         description: Forbidden
 */

const router = Router();

// Hospital: broadcast SMS to matching donors for a specific request
router.post(
    "/broadcast/:requestId",
    requireAuth,
    requireRole("HOSPITAL"),
    notificationController.broadcastToMatchingDonors
);

// Donor: view own notifications
router.get(
    "/mine",
    requireAuth,
    requireRole("DONOR"),
    notificationController.getMyNotifications
);

export default router;