import { prisma } from "../configs/db";

export const getClusterService = async (infrastructure_id: string) => {
    return prisma.cluster.findMany({
        where: {
            infrastructure_id: infrastructure_id
        },
        select: {
            pod_count: true,
            container_count: true,
            service_count: true,
            node_count: true,
        },
        take: 3
    });
}

export const getAllClustersService = async (infrastructure_id: string) => {
    const result = await prisma.cluster.aggregate({
        where: {
            infrastructure_id: infrastructure_id
        },
        _sum: {
            pod_count: true,
            container_count: true,
            service_count: true,
            node_count: true,
        }
    });

    return {
        pod_count: result._sum.pod_count,
        container_count: result._sum.container_count,
        service_count: result._sum.service_count,
        node_count: result._sum.node_count,
    }
}