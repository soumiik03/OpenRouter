import { type Request, type Response } from "express";
import { AuthService } from "../services/auth.service";
import { signToken } from "../lib/jwt";

export async function signup(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const userId = await AuthService.signup(email, password);

        return res.status(201).json({
            id: userId,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: "Error while signing up",
        });
    }
}

export async function signin(req: Request, res: Response) {
    const { email, password } = req.body;

    const { correctCredentials, userId } = await AuthService.signin(email, password);

    if (!correctCredentials || !userId) {
        return res.status(403).json({
            message: "Incorrect credentials",
        });
    }

    const token = signToken(userId);

    res.cookie("auth", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Signed in successfully",
    });
}

export async function profile(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const userData = await AuthService.getUserDetails(Number(userId));

    if (!userData) {
        return res.status(400).json({
            message: "Error while fetching user details",
        });
    }

    return res.status(200).json(userData);
}