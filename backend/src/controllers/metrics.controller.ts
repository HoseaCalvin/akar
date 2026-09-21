import { Request, Response } from 'express';

import { getAverageMetricsService, getMetricsService } from '../services/metrics.service';

export const getMetricsController = async (req: Request, res: Response) => {
    const { infrastructure_id } = req.params;

    if (!infrastructure_id) {
        return res.status(400).json({
            message: 'Missing infrastructure_id parameter'
        });
    }

    try {
        const metrics = await getMetricsService(infrastructure_id as string);
        
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cluster data'
        });
    }
}

export const getAverageMetricsController = async (req: Request, res: Response) => {
    const { infrastructure_id } = req.params;

    if (!infrastructure_id) {
        return res.status(400).json({
            message: 'Missing infrastructure_id parameter'
        });
    }

    try {
        const metrics = await getAverageMetricsService(infrastructure_id as string);
        
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cluster data'
        });
    }
}