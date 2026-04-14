import { prisma } from "../../config/prisma";

export const createPost = async (userId: string, data: { title: string; content: string }) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new Error("Hospital not found");

    return prisma.post.create({
        data: {
            hospitalId: hospital.id,
            title: data.title,
            content: data.content,
        },
        include: { hospital: { select: { name: true, county: true, town: true } } },
    });
};

export const getAllPosts = async () => {
    return prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: { hospital: { select: { name: true, county: true, town: true } } },
    });
};

export const getHospitalPosts = async (userId: string) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new Error("Hospital not found");

    return prisma.post.findMany({
        where: { hospitalId: hospital.id },
        orderBy: { createdAt: "desc" },
        include: { hospital: { select: { name: true, county: true, town: true } } },
    });
};

export const deletePost = async (userId: string, postId: string) => {
    const hospital = await prisma.hospital.findUnique({ where: { userId } });
    if (!hospital) throw new Error("Hospital not found");

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Post not found");
    if (post.hospitalId !== hospital.id) throw new Error("Forbidden");

    return prisma.post.delete({ where: { id: postId } });
};