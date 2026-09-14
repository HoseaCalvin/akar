import { Router } from 'express';
import { getAverageMetricsController, getMetricsController } from '../controllers/metrics.controller';

const metricsRouter: Router = Router();

metricsRouter.get(`/get/:infrastructure_id`, getMetricsController);
metricsRouter.get(`/avg/get/:infrastructure_id`, getAverageMetricsController);


export default metricsRouter;