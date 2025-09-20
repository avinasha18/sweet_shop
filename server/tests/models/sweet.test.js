import mongoose from 'mongoose';
import Sweet from '../../models/Sweet.js';

describe('Sweet Model', () => {
  describe('Sweet Creation', () => {
    test('should create a sweet with valid data', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake',
        imageUrl: 'https://example.com/chocolate-cake.jpg'
      };

      const sweet = new Sweet(sweetData);
      const savedSweet = await sweet.save();

      expect(savedSweet._id).toBeDefined();
      expect(savedSweet.name).toBe(sweetData.name);
      expect(savedSweet.category).toBe(sweetData.category);
      expect(savedSweet.price).toBe(sweetData.price);
      expect(savedSweet.quantity).toBe(sweetData.quantity);
      expect(savedSweet.description).toBe(sweetData.description);
      expect(savedSweet.imageUrl).toBe(sweetData.imageUrl);
    });

    test('should set default quantity to 0', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      const savedSweet = await sweet.save();

      expect(savedSweet.quantity).toBe(0);
    });
  });

  describe('Sweet Validation', () => {
    test('should require name', async () => {
      const sweetData = {
        category: 'Candy',
        price: 5.99,
        quantity: 10,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should require category', async () => {
      const sweetData = {
        name: 'Test Sweet',
        price: 5.99,
        quantity: 10,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should require price', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        quantity: 10,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should require positive price', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: -5.99,
        quantity: 10,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should require non-negative quantity', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: -1,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should require description', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 10
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });

    test('should validate category enum', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'InvalidCategory',
        price: 5.99,
        quantity: 10,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await expect(sweet.save()).rejects.toThrow();
    });
  });

  describe('Sweet Methods', () => {
    test('should check if sweet is in stock', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 5,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await sweet.save();

      expect(sweet.isInStock()).toBe(true);

      sweet.quantity = 0;
      await sweet.save();
      expect(sweet.isInStock()).toBe(false);
    });

    test('should check if sweet has sufficient stock', async () => {
      const sweetData = {
        name: 'Test Sweet',
        category: 'Candy',
        price: 5.99,
        quantity: 5,
        description: 'Test description'
      };

      const sweet = new Sweet(sweetData);
      await sweet.save();

      expect(sweet.hasSufficientStock(3)).toBe(true);
      expect(sweet.hasSufficientStock(5)).toBe(true);
      expect(sweet.hasSufficientStock(6)).toBe(false);
    });
  });
});
