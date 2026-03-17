import { prisma } from "../../config/prisma";
import { BloodGroup, RequestStatus } from "@prisma/client";
import { AppError } from "../../middleware/errorHandler";

interface CreateRequestInput {
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    county: string;
    town: string;
}

export const createRequest = async (userId: string, input: CreateRequestInput) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new AppError("Hospital profile not found", 404);

    return prisma.donationRequest.create({
        data: {
            hospitalId: hospital.id,
            bloodGroup: input.bloodGroup,
            unitsNeeded: input.unitsNeeded,
            county: input.county,
            town: input.town,
        },
        include: { hospital: true },
    });
};

export const getAllRequests = async () => {
    return prisma.donationRequest.findMany({
        where: { status: RequestStatus.ACTIVE },
        include: { hospital: true },
        orderBy: { createdAt: "desc" },
    });
};

export const getMyRequests = async (userId: string) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new AppError("Hospital profile not found", 404);

    return prisma.donationRequest.findMany({
        where: { hospitalId: hospital.id },
        orderBy: { createdAt: "desc" },
    });
};

export const updateRequestStatus = async (
    userId: string,
    requestId: string,
    status: RequestStatus
) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new AppError("Hospital profile not found", 404);

    const request = await prisma.donationRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new AppError("Request not found", 404);
    if (request.hospitalId !== hospital.id) throw new AppError("Forbidden", 403);

    return prisma.donationRequest.update({
        where: { id: requestId },
        data: { status },
    });
};