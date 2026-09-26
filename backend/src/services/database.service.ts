import { prisma } from "../configs/db";

export const databaseStatsService = async (user_id: string) => {
    return prisma.db_monitoring.findFirst({
        where: {
            user_id: user_id
        },
        select: {
            total_database: true,
            slow_queries: true,
            active_connections: true,
            high_cpu_usage: true,
            high_disk_usage: true,
            db_backup_monitoring: {
                select: {
                    success_count: true,
                    warning_count: true,
                    failed_count: true,
                }
            }
        }
    })
}

export const databaseMetricsService = async (database_id: string) => {
    return prisma.db_resource_metrics.findMany({
        where: {
            db_monitoring_id: database_id
        },
        select: {
            cpu: true,
            memory: true,
            disk: true,
            io: true,
            time: true
        }
    })
}

export const databaseQueryListService = async (database_id: string) => {
    return prisma.db_query_list.findMany({
        where: {
            db_monitoring_id: database_id
        },
        select: {
            query: true,
            database: true,
            user_app: true,
            duration: true,
            severity: {
                select: {
                    name: true
                }
            },
            last_seen: true
        }
    })    
}