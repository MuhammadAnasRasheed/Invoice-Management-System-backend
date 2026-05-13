import { UserRepository } from '../repositories/UserRepository';
import { TokenService } from './TokenService';
import { Customer } from '../entities/Customer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export class CustomerService {
  private customerRepository: UserRepository;
  private tokenService: TokenService;

  constructor() {
    this.customerRepository = UserRepository.getInstance();
    this.tokenService = TokenService.getInstance(); // Dependency Injection
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    gstNumber?: string;
  }): Promise<{ customer: Partial<Customer>; token: string }> {
    // Check if customer already exists
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, Number (process.env.SALT));

    // Create customer
    const customer = await this.customerRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate JWT token using TokenService
    const token = this.tokenService.generateToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    // Return customer without password
    const { password, ...customerWithoutPassword } = customer;
    return { customer: customerWithoutPassword, token };
  }

  async login(email: string, password: string): Promise<{ customer: Partial<Customer>; token: string }> {
    // Find customer with password field
    const customer = await this.customerRepository.findByEmailWithPassword(email);
    if (!customer) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token using TokenService
    const token = this.tokenService.generateToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    // Return customer without password
    const { password: _, ...customerWithoutPassword } = customer;
    return { customer: customerWithoutPassword, token };
  }

  async getCustomerById(id: string): Promise<Partial<Customer> | null> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) return null;
    
    const { password, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }
}