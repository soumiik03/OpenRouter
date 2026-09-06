import { type Request, type Response } from "express";
import { Payments } from "../services/payments.service";

export async function onramp(req: Request, res: Response) {
    const credits = await Payments.onramp(Number(req.userId));
    return res.status(200).json({ message: "Onramp successful", credits });
}
