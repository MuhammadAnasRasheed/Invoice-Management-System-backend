import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Public routes (no authentication needed)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/checkprofile', authMiddleware, userController.getProfile);
router.put('/updateprofile', authMiddleware, userController.updateProfile);
router.post('/logout', authMiddleware, userController.logout);

export default router;