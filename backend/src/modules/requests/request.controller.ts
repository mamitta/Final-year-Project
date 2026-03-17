import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as requestService from "./request.service";
import { RequestStatus } from "@prisma/client";

export const createRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const request = await requestService.createRequest(req.user!.id, req.body);
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
};

export const getAllRequests = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requests = await requestService.getAllRequests();
        res.json(requests);
    } catch (err) {
        next(err);
    }
};

export const getMyRequests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requests = await requestService.getMyRequests(req.user!.id);
        res.json(requests);
    } catch (err) {
        next(err);
    }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (err) {
        next(err);
    }
};