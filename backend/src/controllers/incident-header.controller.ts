import { Request, Response } from "express";
import { allIncidentHeadersService, incidentHeaderService } from "../services/incident-header.service";

export const incidentHeaderController = async (req: Request, res: Response) => {
    const { header_id } = req.params;

    if(!header_id) {
        return res.status(400).json({
            message: "Missing header_id parameter"
        });
    }

    try {
        const incidentHeader = await incidentHeaderService(header_id as string);

        res.status(200).json(incidentHeader);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching incident timeline data",
        });        
    }
}

export const allIncidentHeadersController = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            message: "Missing user_id parameter",
        });
    }

    try {
        const incidentHeader = await allIncidentHeadersService(user_id as string);
        
        res.status(200).json(incidentHeader);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching incident timeline data",
        });
    }
}