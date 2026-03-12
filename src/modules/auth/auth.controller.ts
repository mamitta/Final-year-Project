import { Request, Response } from "express";
import * as authService from "./auth.service";

export const registerDonor = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.registerDonor(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const registerHospital = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.registerHospital(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};