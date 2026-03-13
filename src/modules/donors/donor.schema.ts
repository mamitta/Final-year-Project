import { z } from "zod";

export const updateDonorSchema = z.object({
    county: z.string().min(1, "County is required").optional(),
    town: z.string().min(1, "Town is required").optional(),
    lastDonationDate: z.string()
        .datetime("Invalid date format")
        .transform((val) => new Date(val))
        .optional(),
});