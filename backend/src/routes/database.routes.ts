import { Router } from "express";

import { databaseStatsController, databaseMetricsController, databaseQueryListController } from "../controllers/database.controller";

const databaseRouter: Router = Router();

databaseRouter.get('/stats/get/:user_id', databaseStatsController);
databaseRouter.get('/metrics/get/:database_id', databaseMetricsController);
databaseRouter.get('/query/get/:database_id', databaseQueryListController);

export default databaseRouter;