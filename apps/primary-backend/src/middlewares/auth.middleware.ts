import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies.auth;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const decoded = verifyToken(token);

        req.userId = decoded.userId;

        next();
    } catch {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
}
