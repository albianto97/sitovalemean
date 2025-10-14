import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProduct,
    listProduct,
    updateProduct,
    updateQuantity
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { authOptional } from '../middleware/authMiddleware.js';


const router = Router();

// ✅ Middleware opzionale: se c'è token lo decodifica, altrimenti continua
router.get('/', authOptional, listProduct);
router.get('/:id', getProduct);

router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

// Aggiorna quantità (consentito ad admin)
// Nota: la prenotazione standard usa /reservations/add|remove
router.patch('/:id/quantity', authMiddleware, adminMiddleware, updateQuantity);

export default router;
