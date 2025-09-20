import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import Sweet from '../../models/Sweet.js';
import { sweetRoutes } from '../../routes/sweetRoutes.js';
import { authRoutes } from '../../routes/authRoutes.js';
import { errorHandler } from '../../middleware/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use(errorHandler);

describe('Sweets Controller', () => {
  let userToken, adminToken, adminUser, regularUser;

  beforeEach(async () => {
    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    };
    adminUser = new User(adminData);
    await adminUser.save();

    // Create regular user
    const userData = {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    };
    regularUser = new User(userData);
    await regularUser.save();

    // Login admin and get token
    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLoginResponse.body.accessToken;

    // Login user and get token
    const userLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userLoginResponse.body.accessToken;
  });

  describe('POST /api/sweets (Admin only)', () => {
    test('should create a sweet with valid data (admin)', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting',
        imageUrl: 'https://example.com/chocolate-cake.jpg'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.category).toBe(sweetData.category);
      expect(response.body.sweet.price).toBe(sweetData.price);
      expect(response.body.sweet.quantity).toBe(sweetData.quantity);
    });

    test('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting'
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    test('should not create sweet with user role (non-admin)', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    test('should not create sweet with invalid data', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'InvalidCategory',
        price: -5.99,
        quantity: 10,
        description: 'Short'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      const sweets = [
        {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
          description: 'Delicious chocolate cake with rich frosting'
        },
        {
          name: 'Vanilla Cookie',
          category: 'Cookies',
          price: 5.99,
          quantity: 20,
          description: 'Soft vanilla cookies with chocolate chips'
        },
        {
          name: 'Strawberry Ice Cream',
          category: 'Ice Cream',
          price: 8.99,
          quantity: 15,
          description: 'Creamy strawberry ice cream'
        }
      ];

      for (const sweet of sweets) {
        await new Sweet(sweet).save();
      }
    });

    test('should get all sweets with pagination', async () => {
      const response = await request(app)
        .get('/api/sweets?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });

    test('should get sweets filtered by category', async () => {
      const response = await request(app)
        .get('/api/sweets?category=Cakes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].category).toBe('Cakes');
    });

    test('should get sweets filtered by price range', async () => {
      const response = await request(app)
        .get('/api/sweets?minPrice=5&maxPrice=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(2);
      response.body.sweets.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(5);
        expect(sweet.price).toBeLessThanOrEqual(10);
      });
    });

    test('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets?q=chocolate')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name.toLowerCase()).toContain('chocolate');
    });
  });

  describe('GET /api/sweets/:id', () => {
    let sweet;

    beforeEach(async () => {
      sweet = new Sweet({
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting'
      });
      await sweet.save();
    });

    test('should get sweet by id', async () => {
      const response = await request(app)
        .get(`/api/sweets/${sweet._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweet.name).toBe(sweet.name);
      expect(response.body.sweet._id.toString()).toBe(sweet._id.toString());
    });

    test('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/sweets/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sweet not found');
    });
  });

  describe('PUT /api/sweets/:id (Admin only)', () => {
    let sweet;

    beforeEach(async () => {
      sweet = new Sweet({
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting'
      });
      await sweet.save();
    });

    test('should update sweet with valid data (admin)', async () => {
      const updateData = {
        name: 'Updated Chocolate Cake',
        price: 29.99,
        quantity: 15
      };

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sweet.name).toBe(updateData.name);
      expect(response.body.sweet.price).toBe(updateData.price);
      expect(response.body.sweet.quantity).toBe(updateData.quantity);
    });

    test('should not update sweet without authentication', async () => {
      const updateData = {
        name: 'Updated Chocolate Cake',
        price: 29.99
      };

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should not update sweet with user role (non-admin)', async () => {
      const updateData = {
        name: 'Updated Chocolate Cake',
        price: 29.99
      };

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/sweets/:id (Admin only)', () => {
    let sweet;

    beforeEach(async () => {
      sweet = new Sweet({
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 10,
        description: 'Delicious chocolate cake with rich frosting'
      });
      await sweet.save();
    });

    test('should delete sweet (admin)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Sweet deleted successfully');

      // Verify sweet is deleted
      const deletedSweet = await Sweet.findById(sweet._id);
      expect(deletedSweet).toBeNull();
    });

    test('should not delete sweet without authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should not delete sweet with user role (non-admin)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
