import { prisma } from "db";

export const AuthService = {
    async signup(email: string, password: string) {
        const user = await prisma.user.create({
            data: {
                email,
                password: await Bun.password.hash(password),
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
            select: { credits: true },
        });
    }
}
    

