import { Request, Response } from "express";
import { databaseMetricsService, databaseQueryListService, databaseStatsService } from "../services/database.service";

export const databaseStatsController = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return res.status(400).json({
            message: "Missing database_id parameter"
        });
    }

    try {
        const databaseStats = await databaseStatsService(user_id as string);

        res.status(200).json(databaseStats);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching database statistics data",
        });        
    }
}

export const databaseMetricsController = async (req: Request, res: Response) => {
    const { database_id } = req.params;

    if(!database_id) {
        return res.status(400).json({
            message: "Missing database_id parameter"
        });
    }    

    try {
        const databaseMetrics = await databaseMetricsService(database_id as string);

        res.status(200).json(databaseMetrics);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching database metrics data",
        });        
    }
}

export const databaseQueryListController = async (req: Request, res: Response) => {
    const { database_id } = req.params;

    if(!database_id) {
        return res.status(400).json({
            message: "Missing database_id parameter"
        });
    }    

    try {
        const databaseMetrics = await databaseQueryListService(database_id as string);

        res.status(200).json(databaseMetrics);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching database query list data",
        });        
    }    
}