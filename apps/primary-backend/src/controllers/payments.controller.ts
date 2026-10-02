import { type Request, type Response } from "express";
import { Payments } from "../services/payments.service";

export async function onramp(req: Request, res: Response) {
    const rawAmount = req.body?.amount;
    const amount = Number(rawAmount) || 1000;
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid credit amount" });
    }
    const credits = await Payments.onramp(Number(req.userId), Math.floor(amount));
    return res.status(200).json({ message: "Onramp successful", credits, amount: Math.floor(amount) });
}

export async function getTransactions(req: Request, res: Response) {
    const transactions = await Payments.getTransactions(Number(req.userId));
    return res.status(200).json({ transactions });
}
