import { Request, Response } from 'express';
import { getAllClustersService, getClusterService } from '../services/cluster.service';

export const getClusterController = async (req: Request, res: Response) => {
    const { infrastructure_id } = req.params;

    if (!infrastructure_id) {
        return res.status(400).json({
            message: 'Missing infrastructure_id parameter'
        });
    }

    try {
        const cluster = await getClusterService(infrastructure_id as string);
        
        res.status(200).json(cluster);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cluster data'
        });
    }
}

export const getAllClustersController = async (req: Request, res: Response) => {
    const { infrastructure_id } = req.params;

    if (!infrastructure_id) {
        return res.status(400).json({
            message: 'Missing infrastructure_id parameter'
        });
    }

    try {
        const clusters = await getAllClustersService(infrastructure_id as string);
        res.status(200).json(clusters);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching all cluster data'
        });
    }
}