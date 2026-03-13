import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import * as requestController from "./request.controller";
import { validate } from "../../middleware/validate";
import { createRequestSchema, updateRequestStatusSchema } from "./request.schema";
const router = Router();

// Public (authenticated): view all active requests
router.get("/", requireAuth, requestController.getAllRequests);

// Hospital: manage own requests
router.post("/", requireAuth, requireRole("HOSPITAL"), validate(createRequestSchema), requestController.createRequest);
router.get("/mine", requireAuth, requireRole("HOSPITAL"), requestController.getMyRequests);
router.patch("/:id/status", requireAuth, requireRole("HOSPITAL"), validate(updateRequestStatusSchema), requestController.updateRequestStatus);

export default router;