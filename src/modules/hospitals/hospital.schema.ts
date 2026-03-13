import { z } from "zod";

export const updateHospitalSchema = z.object({
    name: z.string().min(1, "Hospital name is required").optional(),
    county: z.string().min(1, "County is required").optional(),
    town: z.string().min(1, "Town is required").optional(),
    phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
});