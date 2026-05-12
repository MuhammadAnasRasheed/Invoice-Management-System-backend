import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/CustomerService';
import { validateRegister, validateLogin } from '../validators/customerValidators'
import { AuthRequest } from '../middleware/auth';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input
      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      // Register customer
      const { customer, token } = await this.customerService.register(validation.data!);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { customer, token }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input
      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      // Login customer
      const { customer, token } = await this.customerService.login(
        validation.data!.email,
        validation.data!.password
      );
      
      res.json({
        success: true,
        message: 'Login successful',
        data: { customer, token }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Since JWT is stateless, logout is handled on client side by removing token
      // But we can add token to blacklist if needed (requires Redis)
      res.json({
        success: true,
        message: 'Logout successful. Please remove token from client.'
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const customer = await this.customerService.getCustomerById(req.user.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };
}