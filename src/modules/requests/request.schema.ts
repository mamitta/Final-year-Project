import { z } from "zod";

export const createRequestSchema = z.object({
    bloodGroup: z.enum(["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"]),
    unitsNeeded: z.number()
        .int("Must be a whole number")
        .min(1, "At least 1 unit is required"),
    county: z.string().min(1, "County is required"),
    town: z.string().min(1, "Town is required"),
});

export const updateRequestStatusSchema = z.object({
    status: z.enum(["ACTIVE", "FULFILLED", "CANCELLED"]),
});