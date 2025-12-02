import { Router } from 'express';
import { ExecutionController } from '../controllers/ExecutionController';

const router = Router();


router.get('/', ExecutionController.index);

export { router as executionRoutes };
