import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as requestController from "./request.controller";

const router = Router();

// Public (authenticated): view all active requests
router.get("/", requireAuth, requestController.getAllRequests);

// Hospital: manage own requests
router.post("/", requireAuth, requireRole("HOSPITAL"), requestController.createRequest);
router.get("/mine", requireAuth, requireRole("HOSPITAL"), requestController.getMyRequests);
router.patch("/:id/status", requireAuth, requireRole("HOSPITAL"), requestController.updateRequestStatus);

export default router;