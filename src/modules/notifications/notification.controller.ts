import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as notificationService from "./notification.service";

export const broadcastToMatchingDonors = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await notificationService.broadcastToMatchingDonors(req.params.requestId as string);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.user!.id);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};