import { Router } from 'express';
import { addSymbol, dashboard, logout } from '../controllers/users/controller';
import validate from '../middlerwares/input-validations';
import { addSymbolValidator } from '../controllers/users/validator';
import enforceAuth from '../middlerwares/enforce-auth';

const router = Router()

//router.use(enforceAuth)
router.get('/dashboard', dashboard)
router.post('/symbols/add', validate(addSymbolValidator), addSymbol)
router.get('/logout', logout)

export default router