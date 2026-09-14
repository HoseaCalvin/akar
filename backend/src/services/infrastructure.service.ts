import { prisma } from "../configs/db";

export const getInfrastructureService = async (user_id: string) => {
    return prisma.infrastructure.findFirst({
        where: {
            user_id: user_id
        },
        select: {
            health: true,
            mttd: true,
            mttr: true,
            rca_time: true,
        }
    });
}