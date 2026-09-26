import { prisma } from "../configs/db";

export const getMetricsService = async (infrastructure_id: string) => {
    return prisma.metrics.findMany({
        where: {
            infrastructure_id: infrastructure_id
        },
        select: {
            mttd: true,
            mttr: true,
            rca_time: true,
            time: true,
        }
    });
}

export const getAverageMetricsService = async (infrastructure_id: string) => {
    return prisma.metrics.aggregate({
        where: {
            infrastructure_id: infrastructure_id
        },
        _avg: {
            mttd: true,
            mttr: true,
            rca_time: true,
        }        
    });
}