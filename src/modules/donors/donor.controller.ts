import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as donorService from "./donor.service";

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donor = await donorService.getMyProfile(req.user!.id);
        if (!donor) {
            res.status(404).json({ message: "Donor profile not found" });
            return;
        }
        res.json(donor);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donor = await donorService.updateMyProfile(req.user!.id, req.body);
        res.json(donor);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllDonors = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donors = await donorService.getAllDonors();
        res.json(donors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDonorsByBloodGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const donors = await donorService.getDonorsByBloodGroup(req.params.bloodGroup as string);
        res.json(donors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};