import { prisma } from "../../config/prisma";

export const getMyProfile = async (userId: string) => {
    return prisma.donor.findUnique({
        where: { userId },
        include: { user: { select: { email: true, phone: true } } },
    });
};

export const updateMyProfile = async (userId: string, data: {
    county?: string;
    town?: string;
    lastDonationDate?: Date;
}) => {
    return prisma.donor.update({
        where: { userId },
        data,
    });
};

export const getAllDonors = async () => {
    return prisma.donor.findMany({
        include: { user: { select: { email: true, phone: true } } },
    });
};

export const getDonorsByBloodGroup = async (bloodGroup: string) => {
    return prisma.donor.findMany({
        where: { bloodGroup: bloodGroup as any },
        include: { user: { select: { email: true, phone: true } } },
    });
};