import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { CustomerRepository } from '../repositories/CustomerRepository';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token using TokenService
    const tokenService = TokenService.getInstance();
    const decoded = tokenService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    // Check if customer still exists
    const customerRepository = CustomerRepository.getInstance();
    const customer = await customerRepository.findById(decoded.id);
    
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid token. Customer not found.' });
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};