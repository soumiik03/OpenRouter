import { type NextFunction, type Request, type Response } from "express";
import { type ZodType } from "zod";

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues?.[0]?.message || "Invalid request";
            return res.status(400).json({
                message: firstError,
            });
        }
        req.body = result.data;
        next();
    };
}

export function validateParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid request",
            });
        }
        next();
    };
}
