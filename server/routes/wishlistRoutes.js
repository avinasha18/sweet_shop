import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticateToken);

// Wishlist routes
router.get('/', getWishlist);
router.post('/add/:sweetId', addToWishlist);
router.delete('/remove/:sweetId', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.get('/check/:sweetId', checkWishlistItem);

export { router as wishlistRoutes };
