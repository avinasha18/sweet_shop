import express from 'express';
import {
  createSweet,
  getSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import { validateRequest, validateQuery } from '../utils/validation.js';
import {
  sweetSchema,
  sweetUpdateSchema,
  purchaseSchema,
  restockSchema,
  sweetsQuerySchema
} from '../utils/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateQuery(sweetsQuerySchema), getSweets);
router.get('/search', validateQuery(sweetsQuerySchema), getSweets); // Dedicated search endpoint
router.get('/:id', getSweetById);

// Protected routes (require authentication)
router.post('/:id/purchase', authenticateToken, validateRequest(purchaseSchema), purchaseSweet);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateRequest(sweetSchema), createSweet);
router.put('/:id', authenticateToken, requireAdmin, validateRequest(sweetUpdateSchema), updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);
router.post('/:id/restock', authenticateToken, requireAdmin, validateRequest(restockSchema), restockSweet);

export { router as sweetRoutes };
