import { prisma } from "db";

export const Payments = {
    async onramp(userId: number, amount: number = 1000) {
        const [user] = await prisma.$transaction([
            prisma.user.update({ 
                where: { id: userId }, 
                data: { credits: { increment: amount } } 
            }),
            prisma.onrampTransaction.create({ data: { userId, amount, status: "completed" } }),
        ]);
        return user.credits;
    },
    async getTransactions(userId: number) {
        return prisma.onrampTransaction.findMany({
            where: { userId },
            orderBy: { id: "desc" },
            take: 50,
        });
    },
};
