import { prisma } from "../configs/db";

export const incidentHeaderService = async (header_id: string) => {
    return prisma.incidentHeader.findFirst({
        where: {
            id: header_id
        },
        select: {
            id: true,
            code: true,
            title: true,
            namespace: true,
            severity: {
                select: {
                    name: true
                },
            },
            status: true,
            cause: true,
            cpu_usage: true,
            memory_usage: true,
            restart_count: true,
            confidence: true,
            start_time: true,
            end_time: true,
            affected_service: true,            
        }
    })
}

export const allIncidentHeadersService = async (user_id: string) => {
    return prisma.incidentHeader.findMany({
        where: {
            user_id: user_id
        },
        select: {
            id: true,
            code: true,
            title: true,
            namespace: true,
            severity: {
                select: {
                    name: true
                },
            },
            status: true,
            cause: true,
            cpu_usage: true,
            memory_usage: true,
            restart_count: true,
            confidence: true,
            start_time: true,
            end_time: true,
            affected_service: true,
        }
    })
}