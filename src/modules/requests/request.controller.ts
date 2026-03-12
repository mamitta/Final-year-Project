import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as requestService from "./request.service";
import { RequestStatus } from "@prisma/client";

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const request = await requestService.createRequest(req.user!.id, req.body);
        res.status(201).json(request);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllRequests = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requests = await requestService.getAllRequests();
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requests = await requestService.getMyRequests(req.user!.id);
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        if (!Object.values(RequestStatus).includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const request = await requestService.updateRequestStatus(
            req.user!.id,
            req.params.id as string,
            status
        );
        res.json(request);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};