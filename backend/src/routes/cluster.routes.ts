import { Router } from "express";

import { getAllClustersController, getClusterController } from "../controllers/cluster.controller";

const clusterRouter: Router = Router();

clusterRouter.get(`/get/:infrastructure_id`, getClusterController);
clusterRouter.get(`/all/get/:infrastructure_id`, getAllClustersController);

export default clusterRouter;