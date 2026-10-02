import { type Request, type Response } from "express";
import { AuthService } from "../services/auth.service";
import { signToken } from "../lib/jwt";

import { prisma } from "db";

export async function signup(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({
                message: "An account with this email already exists. Please sign in.",
            });
        }

        const userId = await AuthService.signup(email, password);

        const token = signToken(userId);

        res.cookie("auth", token, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(201).json({
            message: "Account created successfully",
            id: userId,
        });
    } catch (error: any) {
        console.error(error);

        return res.status(400).json({
            message: error?.message || "Error while signing up",
        });
    }
}

export async function signin(req: Request, res: Response) {
    const { email, password } = req.body;

    const { correctCredentials, userId } = await AuthService.signin(email, password);

    if (!correctCredentials || !userId) {
        return res.status(403).json({
            message: "Incorrect email or password",
        });
    }

    const token = signToken(userId);

    res.cookie("auth", token, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Signed in successfully",
    });
}

export async function logout(_req: Request, res: Response) {
    res.clearCookie("auth");
    return res.status(200).json({
        message: "Signed out successfully",
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

