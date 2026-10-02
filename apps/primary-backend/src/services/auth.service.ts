import { prisma } from "db";

export const AuthService = {
    async signup(email: string, password: string) {
        const hashedPassword = await Bun.password.hash(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                credits: 1000,
                onrampTransactions: {
                    create: {
                        amount: 1000,
                        status: "completed"
                    }
                }
            },
        });
        return user.id.toString();
    },
    async signin(email: string, password: string): Promise<{ correctCredentials: boolean; userId?: string }> {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await Bun.password.verify(password, user.password))) {
            return { correctCredentials: false };
        }

        return {
            correctCredentials: true,
            userId: user.id.toString(),
        };
    },
    async getUserDetails(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: { 
                id: true,
                email: true,
                credits: true,
                apiKeys: {
                    where: { deleted: false },
                    select: {
                        id: true,
                        userId: true,
                        name: true,
                        apiKey: true,
                        disabled: true,
                        deleted: true,
                        lastUsed: true,
                        creditsConsumed: true,
                    }
                },
                onrampTransactions: {
                    orderBy: { id: "desc" },
                    take: 20,
                }
            },
        });
    }
}
    

