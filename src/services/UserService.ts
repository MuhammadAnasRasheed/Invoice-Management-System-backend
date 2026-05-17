import { UserRepository } from '../repositories/UserRepository';
import { TokenService } from './TokenService';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export class UserService {
  private userRepository: UserRepository;
  private tokenService: TokenService;

  constructor() {
    this.userRepository = UserRepository.getInstance();
    this.tokenService = TokenService.getInstance();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: Partial<User>; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, Number(process.env.SALT));

    // Create user
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>; token: string }> {
    // Find user with password field
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(id: string, data: { name?: string; email?: string }): Promise<Partial<User> | null> {
    // If email is being changed, check if it's already taken
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already taken');
      }
    }

    const updatedUser = await this.userRepository.update(id, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}