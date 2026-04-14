import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as postService from "./post.service";

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await postService.createPost(req.user!.id, req.body);
        res.status(201).json(post);
    } catch (err) { next(err); }
};

export const getAllPosts = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) { next(err); }
};

export const getHospitalPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const posts = await postService.getHospitalPosts(req.user!.id);
        res.json(posts);
    } catch (err) { next(err); }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await postService.deletePost(req.user!.id, req.params.id as string);
        res.json({ message: "Post deleted" });
    } catch (err) { next(err); }
};