import { Router } from 'express';

import { incidentTimelineController } from '../controllers/incident-timeline.controller';

const incidentTimelineRouter: Router = Router();

incidentTimelineRouter.get('/get/:header_id', incidentTimelineController);

export default incidentTimelineRouter;