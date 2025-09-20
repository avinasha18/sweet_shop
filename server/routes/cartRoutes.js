import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  purchaseCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../utils/validation.js';
import { cartItemSchema } from '../utils/validation.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);
router.post('/add', validateRequest(cartItemSchema), addToCart);
router.put('/update', validateRequest(cartItemSchema), updateCartItem);
router.delete('/item/:sweetId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/purchase', purchaseCart);

export { router as cartRoutes };
