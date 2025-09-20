import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    minlength: [2, 'Sweet name must be at least 2 characters long'],
    maxlength: [100, 'Sweet name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Cakes', 'Candy', 'Cookies', 'Chocolates', 'Ice Cream', 'Pastries', 'Other'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Image URL must be a valid HTTP/HTTPS URL']
  }
}, {
  timestamps: true
});

// Index for search functionality
sweetSchema.index({ name: 'text', description: 'text' });
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });

// Instance methods
sweetSchema.methods.isInStock = function() {
  return this.quantity > 0;
};

sweetSchema.methods.hasSufficientStock = function(requestedQuantity) {
  return this.quantity >= requestedQuantity;
};

export default mongoose.model('Sweet', sweetSchema);
