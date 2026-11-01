import { Router } from 'express';
import { ShopController } from '../controllers/ShopController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const shopController = new ShopController();

// All shop routes require authentication (user must be logged in)
router.post('/', authMiddleware, shopController.createShop);
router.get('/', authMiddleware, shopController.getAllShops);
router.get('/:id', authMiddleware, shopController.getShopById);
router.put('/:id', authMiddleware, shopController.updateShop);
router.delete('/:id', authMiddleware, shopController.deleteShop);

export default router;

