import { NextFunction,Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as hospitalService from "./hospital.service";


export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const hospital = await hospitalService.getMyProfile(req.user!.id);
        if (!hospital) {
            res.status(404).json({ message: "Hospital profile not found" });
            return;
        }
        res.json(hospital);
    } catch (err) {
        next(err);
    }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const hospital = await hospitalService.updateMyProfile(req.user!.id, req.body);
        res.json(hospital);
    } catch (err) {
        next(err);
    }
};

export const getAllHospitals = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const hospitals = await hospitalService.getAllHospitals();
        res.json(hospitals);
    } catch (err) {
        next(err);
    }
};