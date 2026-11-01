import { Response, NextFunction } from 'express';
import { ShopService } from '../services/ShopService';
import { validateCreateShop, validateUpdateShop } from '../validators/shopValidator';
import { AuthRequest } from '../middleware/auth';

export class ShopController {
  private shopService: ShopService;

  constructor() {
    this.shopService = new ShopService();
  }

  // Create a new shop (authenticated user registers a shop)
  createShop = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const validation = validateCreateShop(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const shop = await this.shopService.createShop(
        validation.data!,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Shop registered successfully',
        data: shop
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all shops for logged-in user
  getAllShops = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const search = req.query.search as string;
      const shops = await this.shopService.getAllShops(req.user.id, search);

      res.status(200).json({
        success: true,
        data: shops
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single shop by ID
  getShopById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const shop = await this.shopService.getShopById(req.params.id as string, req.user.id);
      if (!shop) {
        res.status(404).json({ success: false, message: 'Shop not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: shop
      });
    } catch (error) {
      next(error);
    }
  };

  // Update shop
  updateShop = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const validation = validateUpdateShop(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const shop = await this.shopService.updateShop(
        req.params.id as string,
        validation.data!,
        req.user.id
      );

      if (!shop) {
        res.status(404).json({ success: false, message: 'Shop not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Shop updated successfully',
        data: shop
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete shop
  deleteShop = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const deleted = await this.shopService.deleteShop(req.params.id as string, req.user.id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Shop not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Shop deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

