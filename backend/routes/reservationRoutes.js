import { Router } from 'express';
import {
    addProduct,
    clearReservations,
    getMyReservations,
    removeProduct
} from '../controllers/reservationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/my', getMyReservations);
router.post('/add/:productId', addProduct);
router.delete('/remove/:productId', removeProduct);
router.delete('/clear', clearReservations);

export default router;
