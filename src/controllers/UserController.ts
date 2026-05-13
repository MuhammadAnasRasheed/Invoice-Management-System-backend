import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth';
import { validateRegister, validateLogin, validateUpdateProfile } from '../validators/userValidator';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        res.status(400).json({ 
          success: false, 
          errors: validation.errors 
        });
        return;
      }

      const { user, token } = await this.userService.register(validation.data!);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        res.status(400).json({ 
          success: false, 
          errors: validation.errors 
        });
        return;
      }

      const { user, token } = await this.userService.login(
        validation.data!.email,
        validation.data!.password
      );
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      
      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const validation = validateUpdateProfile(req.body);
      if (!validation.isValid) {
        res.status(400).json({ 
          success: false, 
          errors: validation.errors 
        });
        return;
      }

      const user = await this.userService.updateProfile(req.user.id, validation.data!);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully. Please remove token from client side.'
      });
    } catch (error) {
      next(error);
    }
  };
}