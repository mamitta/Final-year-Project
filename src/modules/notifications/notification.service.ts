import { prisma } from "../../config/prisma";
import { BloodGroup } from "@prisma/client";
import { AppError } from "../../middleware/errorHandler";

const GAVA_API_URL = "https://api.gavaconnect.com/v1/sms/send"; // update if different
const GAVA_API_KEY = process.env.GAVA_API_KEY as string;

// Send SMS via GavaConnect
const sendSms = async (phone: string, message: string): Promise<string | null> => {
    try {
        const response = await fetch(GAVA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GAVA_API_KEY}`,
            },
            body: JSON.stringify({ to: phone, message }),
        });

        const data = await response.json() as any;
        return data?.messageId ?? null;
    } catch (error) {
        console.error("GavaConnect SMS error:", error);
        return null;
    }
};

export const broadcastToMatchingDonors = async (requestId: string) => {
    const request = await prisma.donationRequest.findUnique({
        where: { id: requestId },
        include: { hospital: true },
    });

    if (!request) throw new AppError("Request not found", 404);

    // Find donors matching blood group who donated more than 56 days ago (or never)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 56);

    const donors = await prisma.donor.findMany({
        where: {
            bloodGroup: request.bloodGroup,
            OR: [
                { lastDonationDate: null },
                { lastDonationDate: { lte: cutoffDate } },
            ],
        },
        include: { user: true },
    });

    if (donors.length === 0) return { sent: 0, message: "No eligible donors found" };

    const message =
        `Urgent: ${request.hospital.name} in ${request.county} needs ${request.bloodGroup.replace("_", " ")} blood. ` +
        `${request.unitsNeeded} units needed. Please visit to donate. Reply STOP to opt out.`;

    const notifications = await Promise.all(
        donors.map(async (donor) => {
            const gavaMessageId = await sendSms(donor.user.phone, message);

            return prisma.notification.create({
                data: {
                    userId: donor.userId,
                    requestId: request.id,
                    message,
                    gavaMessageId,
                },
            });
        })
    );

    return { sent: notifications.length, donors: donors.length };
};

export const getNotificationsForUser = async (userId: string) => {
    return prisma.notification.findMany({
        where: { userId },
        include: { request: { include: { hospital: true } } },
        orderBy: { sentAt: "desc" },
    });
};