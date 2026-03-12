import { prisma } from "../../config/prisma";

export const getMyProfile = async (userId: string) => {
    return prisma.hospital.findUnique({
        where: { userId },
        include: { user: { select: { email: true, phone: true } } },
    });
};

export const updateMyProfile = async (userId: string, data: {
    name?: string;
    county?: string;
    town?: string;
    phone?: string;
}) => {
    return prisma.hospital.update({
        where: { userId },
        data,
    });
};

export const getAllHospitals = async () => {
    return prisma.hospital.findMany({
        include: { user: { select: { email: true, phone: true } } },
    });
};