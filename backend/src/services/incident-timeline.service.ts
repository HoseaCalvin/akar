import { prisma } from "../configs/db"

export const incidentTimelineService = async (timeline_header_id: string) => {
    return prisma.incidentTimeline.findMany({
        where: {
            header_id: timeline_header_id
        },
        select: {
            id: true,
            header_id: true,
            time_log: true,
            title: true,
            description: true,
            additional_description: true,
        }
    })
}