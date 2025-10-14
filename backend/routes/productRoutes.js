import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProduct,
    listProducts,
    updateProduct,
    updateQuantity
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

// Aggiorna quantità (consentito ad admin)
// Nota: la prenotazione standard usa /reservations/add|remove
router.patch('/:id/quantity', authMiddleware, adminMiddleware, updateQuantity);

export default router;
