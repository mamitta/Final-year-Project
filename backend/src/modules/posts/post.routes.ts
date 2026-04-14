import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import { validate } from "../../middleware/validate";
import { createPostSchema } from "./post.schema";
import * as postController from "./post.controller";

const router = Router();

// All authenticated users can read posts
router.get("/", requireAuth, postController.getAllPosts);

// Hospital only
router.post("/", requireAuth, requireRole("HOSPITAL"), validate(createPostSchema), postController.createPost);
router.get("/mine", requireAuth, requireRole("HOSPITAL"), postController.getHospitalPosts);
router.delete("/:id", requireAuth, requireRole("HOSPITAL"), postController.deletePost);

export default router;