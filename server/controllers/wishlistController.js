import Wishlist from '../models/Wishlist.js';
import Sweet from '../models/Sweet.js';
import { logger } from '../middleware/errorMiddleware.js';

// Get user's wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    let wishlist = await Wishlist.findOne({ userId })
      .populate('items.sweetId')
      .sort({ 'items.addedAt': -1 });
    
    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = new Wishlist({ userId, items: [] });
      await wishlist.save();
    }
    
    // Filter out items where sweet no longer exists
    const validItems = wishlist.items.filter(item => item.sweetId);
    if (validItems.length !== wishlist.items.length) {
      wishlist.items = validItems;
      await wishlist.save();
    }
    
    logger.info(`Wishlist retrieved for user: ${req.user.email}`);
    
    res.json({
      success: true,
      wishlist: {
        _id: wishlist._id,
        userId: wishlist.userId,
        items: wishlist.items,
        itemCount: wishlist.getItemCount(),
        lastUpdated: wishlist.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Get wishlist error:', error);
    next(error);
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId } = req.params;
    
    // Validate input
    if (!sweetId) {
      return res.status(400).json({
        success: false,
        message: 'Sweet ID is required'
      });
    }
    
    // Check if sweet exists
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }
    
    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    
    // Check if item already exists
    if (wishlist.isItemInWishlist(sweetId)) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    }
    
    // Add item to wishlist
    await wishlist.addItem(sweetId);
    
    // Populate the wishlist with sweet details
    await wishlist.populate('items.sweetId');
    
    logger.info(`Item added to wishlist: ${sweet.name} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: `${sweet.name} added to wishlist`,
      wishlist: {
        _id: wishlist._id,
        userId: wishlist.userId,
        items: wishlist.items,
        itemCount: wishlist.getItemCount(),
        lastUpdated: wishlist.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Add to wishlist error:', error);
    next(error);
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId } = req.params;
    
    // Get wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    // Check if item exists in wishlist
    if (!wishlist.isItemInWishlist(sweetId)) {
      return res.status(400).json({
        success: false,
        message: 'Item not in wishlist'
      });
    }
    
    // Remove item
    await wishlist.removeItem(sweetId);
    
    // Populate the wishlist with sweet details
    await wishlist.populate('items.sweetId');
    
    logger.info(`Item removed from wishlist: ${sweetId} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: {
        _id: wishlist._id,
        userId: wishlist.userId,
        items: wishlist.items,
        itemCount: wishlist.getItemCount(),
        lastUpdated: wishlist.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Remove from wishlist error:', error);
    next(error);
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    // Clear wishlist
    await wishlist.clearWishlist();
    
    logger.info(`Wishlist cleared by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Wishlist cleared',
      wishlist: {
        _id: wishlist._id,
        userId: wishlist.userId,
        items: wishlist.items,
        itemCount: wishlist.getItemCount(),
        lastUpdated: wishlist.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Clear wishlist error:', error);
    next(error);
  }
};

// Check if item is in wishlist
export const checkWishlistItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    const isInWishlist = wishlist ? wishlist.isItemInWishlist(sweetId) : false;
    
    res.json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    logger.error('Check wishlist item error:', error);
    next(error);
  }
};
