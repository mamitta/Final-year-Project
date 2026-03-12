import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { Role, BloodGroup } from "@prisma/client";

interface RegisterDonorInput {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    bloodGroup: BloodGroup;
    county: string;
    town: string;
}

interface RegisterHospitalInput {
    email: string;
    phone: string;
    password: string;
    name: string;
    county: string;
    town: string;
    hospitalPhone: string;
}

interface LoginInput {
    email: string;
    password: string;
}

const generateToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);
};

export const registerDonor = async (input: RegisterDonorInput) => {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
        data: {
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            role: Role.DONOR,
            donor: {
                create: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    bloodGroup: input.bloodGroup,
                    county: input.county,
                    town: input.town,
                },
            },
        },
        include: { donor: true },
    });

    const token = generateToken(user.id, user.role);
    return { token, user: { id: user.id, email: user.email, role: user.role, donor: user.donor } };
};

export const registerHospital = async (input: RegisterHospitalInput) => {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
        data: {
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            role: Role.HOSPITAL,
            hospital: {
                create: {
                    name: input.name,
                    county: input.county,
                    town: input.town,
                    phone: input.hospitalPhone,
                },
            },
        },
        include: { hospital: true },
    });

    const token = generateToken(user.id, user.role);
    return { token, user: { id: user.id, email: user.email, role: user.role, hospital: user.hospital } };
};

export const login = async (input: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { donor: true, hospital: true },
    });

    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error("Invalid email or password");

    const token = generateToken(user.id, user.role);
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            donor: user.donor,
            hospital: user.hospital,
        },
    };
};