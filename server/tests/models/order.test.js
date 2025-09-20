import mongoose from 'mongoose';
import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Sweet from '../../models/Sweet.js';

describe('Order Model', () => {
  let user, sweet;

  beforeEach(async () => {
    // Create test user
    user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    // Create test sweet
    sweet = new Sweet({
      name: 'Test Sweet',
      category: 'Candy',
      price: 5.99,
      quantity: 10,
      description: 'Test description'
    });
    await sweet.save();
  });

  describe('Order Creation', () => {
    test('should create an order with valid data', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      const savedOrder = await order.save();

      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.userId.toString()).toBe(user._id.toString());
      expect(savedOrder.sweetId.toString()).toBe(sweet._id.toString());
      expect(savedOrder.quantity).toBe(orderData.quantity);
      expect(savedOrder.priceAtPurchase).toBe(orderData.priceAtPurchase);
      expect(savedOrder.totalAmount).toBe(orderData.totalAmount);
      expect(savedOrder.status).toBe('completed');
    });

    test('should set default status to completed', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      const savedOrder = await order.save();

      expect(savedOrder.status).toBe('completed');
    });
  });

  describe('Order Validation', () => {
    test('should require userId', async () => {
      const orderData = {
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require sweetId', async () => {
      const orderData = {
        userId: user._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require quantity', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require positive quantity', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 0,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require priceAtPurchase', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should require totalAmount', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });

    test('should validate status enum', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2,
        status: 'invalid_status'
      };

      const order = new Order(orderData);
      await expect(order.save()).rejects.toThrow();
    });
  });

  describe('Order Population', () => {
    test('should populate user and sweet details', async () => {
      const orderData = {
        userId: user._id,
        sweetId: sweet._id,
        quantity: 2,
        priceAtPurchase: sweet.price,
        totalAmount: sweet.price * 2
      };

      const order = new Order(orderData);
      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('userId', 'name email')
        .populate('sweetId', 'name category price');

      expect(populatedOrder.userId.name).toBe(user.name);
      expect(populatedOrder.userId.email).toBe(user.email);
      expect(populatedOrder.sweetId.name).toBe(sweet.name);
      expect(populatedOrder.sweetId.category).toBe(sweet.category);
    });
  });
});
