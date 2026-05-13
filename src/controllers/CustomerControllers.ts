import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/CustomerService';
import { validateCreateCustomer, validateUpdateCustomer } from '../validators/customerValidators';
import { AuthRequest } from '../middleware/auth';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  // Create a new customer (authenticated user adds a client)
  createCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const validation = validateCreateCustomer(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const customer = await this.customerService.createCustomer(
        validation.data!,
        req.user.id
      );
      
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all customers for logged-in user
  getAllCustomers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const customers = await this.customerService.getAllCustomers(req.user.id);
      
      res.status(200).json({
        success: true,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single customer by ID
  getCustomerById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const customer = await this.customerService.getCustomerById(req.params.id as string, req.user.id);
      if (!customer) {
        res.status(404).json({ success: false, message: 'Customer not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };

  // Update customer
  updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const validation = validateUpdateCustomer(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const customer = await this.customerService.updateCustomer(
        req.params.id as string,
        validation.data!,
        req.user.id
      );
      
      if (!customer) {
        res.status(404).json({ success: false, message: 'Customer not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete customer
  deleteCustomer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const deleted = await this.customerService.deleteCustomer(req.params.id as string, req.user.id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Customer not found' });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}