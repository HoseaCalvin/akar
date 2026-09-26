import { Request, Response } from 'express';

import { getInfrastructureService } from '../services/infrastructure.service';

export const getInfrastructureController = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if(!user_id) {
        return res.status(400).json({ 
            message: 'Missing user_id parameter' 
        });
    }

    try {
        const metrics = await getInfrastructureService(user_id as string);

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}