import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh); // GET, так как данные берем из cookie

export default router;