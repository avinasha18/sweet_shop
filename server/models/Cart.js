import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  sweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: [true, 'Sweet ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  priceAtAdd: {
    type: Number,
    required: [true, 'Price at add is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  _id: false
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
cartSchema.index({ userId: 1 });

// Virtual for calculating totals
cartSchema.virtual('calculatedTotals').get(function() {
  let totalItems = 0;
  let totalPrice = 0;
  
  this.items.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.priceAtAdd * item.quantity;
  });
  
  return { totalItems, totalPrice };
});

// Pre-save middleware to update totals
cartSchema.pre('save', function(next) {
  const totals = this.calculatedTotals;
  this.totalItems = totals.totalItems;
  this.totalPrice = totals.totalPrice;
  this.lastUpdated = new Date();
  next();
});

// Instance methods
cartSchema.methods.addItem = function(sweetId, quantity, priceAtAdd) {
  const existingItemIndex = this.items.findIndex(item => 
    item.sweetId.toString() === sweetId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      sweetId,
      quantity,
      priceAtAdd
    });
  }
  
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(sweetId, quantity) {
  const itemIndex = this.items.findIndex(item => 
    item.sweetId.toString() === sweetId.toString()
  );
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      this.items[itemIndex].quantity = quantity;
    }
  }
  
  return this.save();
};

cartSchema.methods.removeItem = function(sweetId) {
  this.items = this.items.filter(item => 
    item.sweetId.toString() !== sweetId.toString()
  );
  
  return this.save();
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.getItemQuantity = function(sweetId) {
  const item = this.items.find(item => 
    item.sweetId.toString() === sweetId.toString()
  );
  
  return item ? item.quantity : 0;
};

cartSchema.methods.isItemInCart = function(sweetId) {
  return this.items.some(item => 
    item.sweetId.toString() === sweetId.toString()
  );
};

export default mongoose.model('Cart', cartSchema);
