import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  items: [{
    sweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sweet',
      required: [true, 'Sweet ID is required']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.sweetId': 1 });

// Instance methods
wishlistSchema.methods.addItem = function(sweetId) {
  // Check if item already exists
  const existingItem = this.items.find(item => 
    item.sweetId.toString() === sweetId.toString()
  );
  
  if (!existingItem) {
    this.items.push({ sweetId });
    this.lastUpdated = new Date();
  }
  
  return this.save();
};

wishlistSchema.methods.removeItem = function(sweetId) {
  this.items = this.items.filter(item => 
    item.sweetId.toString() !== sweetId.toString()
  );
  this.lastUpdated = new Date();
  
  return this.save();
};

wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  this.lastUpdated = new Date();
  return this.save();
};

wishlistSchema.methods.isItemInWishlist = function(sweetId) {
  return this.items.some(item => 
    item.sweetId.toString() === sweetId.toString()
  );
};

wishlistSchema.methods.getItemCount = function() {
  return this.items.length;
};

export default mongoose.model('Wishlist', wishlistSchema);
