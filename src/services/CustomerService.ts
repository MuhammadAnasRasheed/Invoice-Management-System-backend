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
  }, userId: string): Promise<Customer> {
    // Check if customer with this email already exists
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create customer linked to user
    const customer = await this.customerRepository.create({
      ...data,
      user: user
    } as any
    );

    return customer;
  }

  async getAllCustomers(userId: string,search:string): Promise<Customer[]> {
    return await this.customerRepository.findByUser(userId,search);
  }

  async getCustomerById(id: string, userId: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findByIdWithUser(id);
    if (!customer || customer.user.id !== userId) {
      return null;
    }
    return customer;
  }

  async updateCustomer(id: string, data: Partial<Customer>, userId: string): Promise<Customer | null> {
    const customer = await this.getCustomerById(id, userId);
    if (!customer) return null;

    // Remove user field if present to prevent ownership change
    const { user, ...cleanData } = data as any;
    return await this.customerRepository.update(id, cleanData);
  }

  async deleteCustomer(id: string, userId: string): Promise<boolean> {
    try {
      // First, get all invoices of this customer
      const invoices = await AppDataSource.getRepository(Invoice).find({ where: { customer: { id } } });

      // Delete invoice items for each invoice
      for (const invoice of invoices) {
        await AppDataSource.getRepository(InvoiceItem).delete({ invoice: { id: invoice.id } });
      }

      // Then delete invoices
      await AppDataSource.getRepository(Invoice).delete({ customer: { id } });

      // Finally delete the customer
      const result = await this.customerRepository.delete(id);

      return result;
    } catch (error) {
      console.error('Delete customer error:', error);
      return false;
    }
  }
}