import { Request, Response } from "express";
import { incidentTimelineService } from "../services/incident-timeline.service";

export const incidentTimelineController = async (req: Request, res: Response) => {
    const { header_id } = req.params;

    if (!header_id) {
        return res.status(400).json({
            message: "Missing timeline_header_id parameter",
        });
    }

    try {
        const incidentTimeline = await incidentTimelineService(header_id as string);

        res.status(200).json(incidentTimeline);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching incident timeline data",
        });
    }
}