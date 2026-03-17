import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate";
import { registerDonorSchema, registerHospitalSchema, loginSchema } from "./auth.schema";

/**
 * @swagger
 * /api/auth/register/donor:
 *   post:
 *     summary: Register a new donor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, phone, password, firstName, lastName, bloodGroup, county, town]
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bloodGroup:
 *                 type: string
 *                 enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG]
 *               county:
 *                 type: string
 *               town:
 *                 type: string
 *     responses:
 *       201:
 *         description: Donor registered successfully
 *       400:
 *         description: Validation error or email already in use
 *
 * /api/auth/register/hospital:
 *   post:
 *     summary: Register a new hospital
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, phone, password, name, county, town, hospitalPhone]
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               county:
 *                 type: string
 *               town:
 *                 type: string
 *               hospitalPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital registered successfully
 *       400:
 *         description: Validation error or email already in use
 *
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
const router = Router();

// POST /api/auth/register/donor
router.post("/register/donor", validate(registerDonorSchema), authController.registerDonor);

// POST /api/auth/register/hospital
router.post("/register/hospital", validate(registerHospitalSchema), authController.registerHospital);

// POST /api/auth/login
router.post("/login", validate(loginSchema), authController.login);

export default router;