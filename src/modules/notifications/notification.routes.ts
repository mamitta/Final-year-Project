import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as notificationController from "./notification.controller";

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