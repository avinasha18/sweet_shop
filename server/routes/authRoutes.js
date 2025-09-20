import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../utils/validation.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refresh);

// Protected routes
router.post('/logout', authenticateToken, logout);

export { router as authRoutes };
