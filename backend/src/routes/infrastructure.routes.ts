import { Router } from 'express';
import { getInfrastructureController } from '../controllers/infrastructure.controller';

const infrastructureRouter: Router = Router();

infrastructureRouter.get(`/get/:user_id`, getInfrastructureController);

export default infrastructureRouter;