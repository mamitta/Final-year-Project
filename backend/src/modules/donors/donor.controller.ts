import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as donorService from "./donor.service";

export const getMyProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const donor = await donorService.getMyProfile(req.user!.id);
        if (!donor) {
            res.status(404).json({ message: "Donor profile not found" });
            return;
        }
        res.json(donor);
    } catch (err) {
        next(err);
    }
};

export const updateMyProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const donor = await donorService.updateMyProfile(req.user!.id, req.body);
        res.json(donor);
    } catch (err) {
        next(err);

    }
};

export const getAllDonors = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const donors = await donorService.getAllDonors();
        res.json(donors);
    } catch (err) {
        next(err);
    }
};

export const getDonorsByBloodGroup = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const donors = await donorService.getDonorsByBloodGroup(req.params.bloodGroup as string);
        res.json(donors);
    } catch (err) {
        next(err);
    }
};