import { z } from "zod";

export const registerDonorSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required").min(10, "Phone must be at least 10 digits"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    bloodGroup: z.enum(["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"]),
    county: z.string().min(1, "County is required"),
    town: z.string().min(1, "Town is required"),
});

export const registerHospitalSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required").min(10, "Phone must be at least 10 digits"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Hospital name is required"),
    county: z.string().min(1, "County is required"),
    town: z.string().min(1, "Town is required"),
    hospitalPhone: z.string().min(1, "Hospital phone number is required").min(10, "Hospital phone must be at least 10 digits"),
});

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});