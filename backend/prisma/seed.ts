import "dotenv/config";
import { PrismaClient, Role, BloodGroup, RequestStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Create Users
    const donorUser = await prisma.user.create({
        data: {
            email: "donor@example.com",
            phone: "0712345678",
            password: "donorpass",
            role: Role.DONOR,
            donor: {
                create: {
                    firstName: "Alice",
                    lastName: "Wangeci",
                    bloodGroup: BloodGroup.O_POS,
                    county: "Nairobi",
                    town: "Westlands",
                },
            },
        },
    });

    const hospitalUser = await prisma.user.create({
        data: {
            email: "hospital@example.com",
            phone: "0798765432",
            password: "hospitalpass",
            role: Role.HOSPITAL,
            hospital: {
                create: {
                    name: "Nairobi Central Hospital",
                    county: "Nairobi",
                    town: "CBD",
                    phone: "0798000000",
                },
            },
        },
        include: {
            hospital: true,
        },
    });

    // Create Donation Request
    const request = await prisma.donationRequest.create({
        data: {
            hospitalId: hospitalUser.hospital!.id,
            bloodGroup: BloodGroup.O_POS,
            unitsNeeded: 5,
            status: RequestStatus.ACTIVE,
            county: "Nairobi",
            town: "CBD",
        },
    });

    // Create Notification
    await prisma.notification.create({
        data: {
            userId: donorUser.id,
            requestId: request.id,
            message: "New donation request available!",
        },
    });

    console.log("Database seeded successfully ✅");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });