import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { UserRepository } from '../repositories/UserRepository';

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
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const tokenService = TokenService.getInstance();
    const decoded = tokenService.verifyToken(token);
    
    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const userRepository = UserRepository.getInstance();
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      console.log('User not found for id:', decoded.id);
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};