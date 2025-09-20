import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
  sweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: [true, 'Sweet ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  action: {
    type: String,
    enum: ['purchase', 'restock'],
    required: [true, 'Action is required']
  },
  quantityChange: {
    type: Number,
    required: [true, 'Quantity change is required']
  },
  quantityBefore: {
    type: Number,
    required: [true, 'Quantity before is required'],
    min: [0, 'Quantity before cannot be negative']
  },
  quantityAfter: {
    type: Number,
    required: [true, 'Quantity after is required'],
    min: [0, 'Quantity after cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
inventoryLogSchema.index({ sweetId: 1, createdAt: -1 });
inventoryLogSchema.index({ userId: 1 });
inventoryLogSchema.index({ action: 1 });

export default mongoose.model('InventoryLog', inventoryLogSchema);
