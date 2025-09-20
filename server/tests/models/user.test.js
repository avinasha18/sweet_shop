import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
    });

    test('should set default role to user', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.role).toBe('user');
    });

    test('should hash password before saving', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
    });
  });

  describe('User Validation', () => {
    test('should require name', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should require email', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should require password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should require valid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should require unique email', async () => {
      const userData1 = {
        name: 'User 1',
        email: 'test@example.com',
        password: 'password123'
      };

      const userData2 = {
        name: 'User 2',
        email: 'test@example.com',
        password: 'password456'
      };

      await new User(userData1).save();
      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    test('should validate role enum', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid_role'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    test('should compare password correctly', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });
});
