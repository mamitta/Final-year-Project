import { NextFunction,Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as notificationService from "./notification.service";

export const broadcastToMatchingDonors = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await notificationService.broadcastToMatchingDonors(req.params.requestId as string);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.user!.id);
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};