import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            return;
        }
        next();
    };
};