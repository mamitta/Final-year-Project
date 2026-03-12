import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as hospitalService from "./hospital.service";

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hospital = await hospitalService.getMyProfile(req.user!.id);
        if (!hospital) {
            res.status(404).json({ message: "Hospital profile not found" });
            return;
        }
        res.json(hospital);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hospital = await hospitalService.updateMyProfile(req.user!.id, req.body);
        res.json(hospital);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllHospitals = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const hospitals = await hospitalService.getAllHospitals();
        res.json(hospitals);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};