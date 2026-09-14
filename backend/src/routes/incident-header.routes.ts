import { Router } from 'express';

import { allIncidentHeadersController, incidentHeaderController } from '../controllers/incident-header.controller';

const incidentHeaderRouter: Router = Router();

incidentHeaderRouter.get('/all/get/:user_id', allIncidentHeadersController);
incidentHeaderRouter.get('/get/:header_id', incidentHeaderController);

export default incidentHeaderRouter;