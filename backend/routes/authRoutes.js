import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/update', authMiddleware, updateUser);


export default router;
