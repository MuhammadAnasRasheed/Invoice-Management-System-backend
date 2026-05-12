import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const customerController = new CustomerController();

// Public routes
router.post('/register', customerController.register);
router.post('/login', customerController.login);

// Protected routes (require authentication)
router.post('/logout', authMiddleware, customerController.logout);
router.get('/check', authMiddleware, customerController.getMe);

export default router;