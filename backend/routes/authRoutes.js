import { Router } from 'express';
import {login, me, registerUser, updateUser, changePassword} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/update', authMiddleware, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', authMiddleware, changePassword);



export default router;
