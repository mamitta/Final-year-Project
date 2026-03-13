import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
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
app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));
app.use(express.json());

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use(errorHandler);

export default app;