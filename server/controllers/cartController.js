import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Sweet from '../models/Sweet.js';
import { logger } from '../middleware/errorMiddleware.js';

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    let cart = await Cart.findOne({ userId }).populate('items.sweetId');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    // Filter out items where sweet no longer exists
    const validItems = cart.items.filter(item => item.sweetId);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
    
    logger.info(`Cart retrieved for user: ${req.user.email}`);
    
    res.json({
      success: true,
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Get cart error:', error);
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId, quantity } = req.body;
    
    // Validate input
    if (!sweetId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID or quantity'
      });
    }
    
    // Check if sweet exists and has sufficient stock
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }
    
    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check current quantity in cart
    const currentQuantity = cart.getItemQuantity(sweetId);
    const newTotalQuantity = currentQuantity + quantity;
    
    // Check if adding this quantity would exceed available stock
    if (newTotalQuantity > sweet.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${sweet.quantity}, Requested: ${newTotalQuantity}`
      });
    }
    
    // Add item to cart
    await cart.addItem(sweetId, quantity, sweet.price);
    
    // Populate the cart with sweet details
    await cart.populate('items.sweetId');
    
    logger.info(`Item added to cart: ${sweet.name} (${quantity}) by ${req.user.email}`);
    
    res.json({
      success: true,
      message: `${quantity} x ${sweet.name} added to cart`,
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Add to cart error:', error);
    next(error);
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId, quantity } = req.body;
    
    // Validate input
    if (!sweetId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sweet ID or quantity'
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
    
    // Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Check if quantity exceeds available stock
    if (quantity > sweet.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${sweet.quantity}, Requested: ${quantity}`
      });
    }
    
    // Update item quantity
    await cart.updateItemQuantity(sweetId, quantity);
    
    // Populate the cart with sweet details
    await cart.populate('items.sweetId');
    
    logger.info(`Cart item updated: ${sweet.name} (${quantity}) by ${req.user.email}`);
    
    res.json({
      success: true,
      message: `Cart updated`,
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Update cart item error:', error);
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sweetId } = req.params;
    
    // Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Remove item
    await cart.removeItem(sweetId);
    
    // Populate the cart with sweet details
    await cart.populate('items.sweetId');
    
    logger.info(`Item removed from cart: ${sweetId} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Remove from cart error:', error);
    next(error);
  }
};

// Clear entire cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Clear cart
    await cart.clearCart();
    
    logger.info(`Cart cleared by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    logger.error('Clear cart error:', error);
    next(error);
  }
};

// Purchase all items in cart
export const purchaseCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get cart with populated items
    const cart = await Cart.findOne({ userId }).populate('items.sweetId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Validate stock for all items before processing
    const stockValidation = [];
    for (const item of cart.items) {
      if (!item.sweetId) {
        return res.status(400).json({
          success: false,
          message: 'Some items in cart no longer exist'
        });
      }
      
      if (item.quantity > item.sweetId.quantity) {
        stockValidation.push({
          sweetId: item.sweetId._id,
          sweetName: item.sweetId.name,
          requested: item.quantity,
          available: item.sweetId.quantity
        });
      }
    }
    
    if (stockValidation.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for some items',
        stockIssues: stockValidation
      });
    }
    
    // Process purchases atomically using findOneAndUpdate
    const orders = [];
    const inventoryLogs = [];
    
    for (const item of cart.items) {
      // Update sweet quantity atomically
      const updatedSweet = await Sweet.findOneAndUpdate(
        { _id: item.sweetId._id, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
      
      if (!updatedSweet) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.sweetId.name}`
        });
      }
      
      // Create order
      const Order = (await import('../models/Order.js')).default;
      const order = new Order({
        userId,
        sweetId: item.sweetId._id,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAdd,
        totalAmount: item.priceAtAdd * item.quantity
      });
      await order.save();
      orders.push(order);
      
      // Create inventory log
      const InventoryLog = (await import('../models/InventoryLog.js')).default;
      const inventoryLog = new InventoryLog({
        sweetId: item.sweetId._id,
        userId,
        action: 'purchase',
        quantityChange: -item.quantity,
        quantityBefore: updatedSweet.quantity + item.quantity,
        quantityAfter: updatedSweet.quantity,
        notes: `Cart purchase of ${item.quantity} units`
      });
      await inventoryLog.save();
      inventoryLogs.push(inventoryLog);
    }
    
    // Clear cart after successful purchase
    await cart.clearCart();
    
    logger.info(`Cart purchase completed: ${orders.length} items by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Purchase completed successfully',
      orders,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    });
  } catch (error) {
    logger.error('Purchase cart error:', error);
    next(error);
  }
};
