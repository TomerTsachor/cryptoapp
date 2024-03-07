import { Router } from 'express';
import { welcome } from '../controllers/guests/controller';

const router = Router();

router.get('/', welcome);

export default router;