import { Router } from 'express';
import { login, me, registerUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', authMiddleware, me);

export default router;
