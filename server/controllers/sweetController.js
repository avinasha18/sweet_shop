import Sweet from '../models/Sweet.js';
import { logger } from '../middleware/errorMiddleware.js';

export const createSweet = async (req, res, next) => {
  try {
    const sweetData = req.body;
    const sweet = new Sweet(sweetData);
    await sweet.save();

    logger.info(`Sweet created: ${sweet.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Sweet created successfully',
      sweet
    });
  } catch (error) {
    logger.error('Create sweet error:', error);
    next(error);
  }
};

export const getSweets = async (req, res, next) => {
  try {
    const { page, limit, sort, category, minPrice, maxPrice, q, search, inStock } = req.query;

    // Build query
    let query = {};
    
    if (category && category.trim() !== '') {
      query.category = category;
    }
    
    if (minPrice !== undefined && minPrice !== '' && minPrice !== null) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== '' && maxPrice !== null) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }
    
    // Handle both 'q' and 'search' parameters for backward compatibility
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim() !== '') {
      query.$text = { $search: searchTerm };
    }
    
    // Handle inStock filter
    if (inStock === 'true') {
      query.quantity = { $gt: 0 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination and sorting
    const sweets = await Sweet.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Sweet.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    logger.info(`Sweets retrieved: ${sweets.length} sweets, page ${page}`);

    res.json({
      success: true,
      sweets,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    logger.error('Get sweets error:', error);
    next(error);
  }
};

export const getSweetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    logger.info(`Sweet retrieved: ${sweet.name}`);

    res.json({
      success: true,
      sweet
    });
  } catch (error) {
    logger.error('Get sweet by ID error:', error);
    next(error);
  }
};

export const updateSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    logger.info(`Sweet updated: ${sweet.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Sweet updated successfully',
      sweet
    });
  } catch (error) {
    logger.error('Update sweet error:', error);
    next(error);
  }
};

export const deleteSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    logger.info(`Sweet deleted: ${sweet.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    logger.error('Delete sweet error:', error);
    next(error);
  }
};

export const purchaseSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    // Find sweet and check stock using findOneAndUpdate for atomic operation
    const sweet = await Sweet.findOneAndUpdate(
      { 
        _id: id, 
        quantity: { $gte: quantity } // Only update if sufficient stock
      },
      { 
        $inc: { quantity: -quantity } // Atomically decrement quantity
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!sweet) {
      return res.status(400).json({
        success: false,
        message: 'Sweet not found or insufficient stock'
      });
    }

    // Create order record
    const Order = (await import('../models/Order.js')).default;
    const order = new Order({
      userId: req.user._id,
      sweetId: sweet._id,
      quantity,
      priceAtPurchase: sweet.price,
      totalAmount: sweet.price * quantity
    });
    await order.save();

    // Create inventory log
    const InventoryLog = (await import('../models/InventoryLog.js')).default;
    const inventoryLog = new InventoryLog({
      sweetId: sweet._id,
      userId: req.user._id,
      action: 'purchase',
      quantityChange: -quantity,
      quantityBefore: sweet.quantity + quantity,
      quantityAfter: sweet.quantity,
      notes: `Purchase of ${quantity} units`
    });
    await inventoryLog.save();

    logger.info(`Purchase completed: ${quantity} x ${sweet.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Purchase completed successfully',
      sweet: sweet,
      order
    });

  } catch (error) {
    logger.error('Purchase sweet error:', error);
    next(error);
  }
};

export const restockSweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    const quantityBefore = sweet.quantity;
    sweet.quantity += quantity;
    await sweet.save();

    // Create inventory log
    const InventoryLog = (await import('../models/InventoryLog.js')).default;
    const inventoryLog = new InventoryLog({
      sweetId: sweet._id,
      userId: req.user._id,
      action: 'restock',
      quantityChange: quantity,
      quantityBefore,
      quantityAfter: sweet.quantity,
      notes: `Restock of ${quantity} units`
    });
    await inventoryLog.save();

    logger.info(`Restock completed: ${quantity} x ${sweet.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Restock completed successfully',
      sweet
    });
  } catch (error) {
    logger.error('Restock sweet error:', error);
    next(error);
  }
};
