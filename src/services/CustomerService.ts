import { CustomerRepository } from '../repositories/CustomerRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Customer } from '../entities/Customer';
import { InvoiceItem } from '../entities/InvoiceItems';
import { Invoice } from '../entities/Invoice';
import { AppDataSource } from '../config/database';

export class CustomerService {
  private customerRepository: CustomerRepository;
  private userRepository: UserRepository;

  constructor() {
    this.customerRepository = CustomerRepository.getInstance();
    this.userRepository = UserRepository.getInstance();
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }, userId: number | string): Promise<Customer> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    // Check if customer with this email already exists
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    const user = await this.userRepository.findById(numericUserId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create customer linked to user
    const customer = await this.customerRepository.create({
      ...data,
      user: user
    } as any);

    return customer;
  }

  async getAllCustomers(userId: number | string, search?: string): Promise<Customer[]> {
    return await this.customerRepository.findByUser(userId, search);
  }

  async getCustomerById(id: number | string, userId: number | string): Promise<Customer | null> {
    const customer = await this.customerRepository.findByIdWithUser(id);
    if (!customer || Number(customer.user.id) !== Number(userId)) {
      return null;
    }
    return customer;
  }

  async updateCustomer(id: number | string, data: Partial<Customer>, userId: number | string): Promise<Customer | null> {
    const customer = await this.getCustomerById(id, userId);
    if (!customer) return null;

    // Remove user field if present to prevent ownership change
    const { user, ...cleanData } = data as any;
    return await this.customerRepository.update(id, cleanData);
  }

  async deleteCustomer(id: number | string, userId: number | string): Promise<boolean> {
    try {
      const numericId = typeof id === 'string' ? Number(id) : id;
      const customer = await this.getCustomerById(numericId, userId);
      if (!customer) return false;

      // First, get all invoices of this customer
      const invoices = await AppDataSource.getRepository(Invoice).find({ where: { customer: { id: numericId } } });

      // Delete invoice items for each invoice
      for (const invoice of invoices) {
        await AppDataSource.getRepository(InvoiceItem).delete({ invoice: { id: invoice.id } });
      }

      // Then delete invoices
      await AppDataSource.getRepository(Invoice).delete({ customer: { id: numericId } });

      // Finally delete the customer
      const result = await this.customerRepository.delete(numericId);

      return result;
    } catch (error) {
      console.error('Delete customer error:', error);
      return false;
    }
  }
}

