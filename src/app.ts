import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import donorRoutes from "./modules/donors/donor.routes";
import hospitalRoutes from "./modules/hospitals/hospital.routes";
import requestRoutes from "./modules/requests/request.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

export default app;