import { BaseRepository } from './BaseRepository';
import { Customer } from '../entities/Customer';
import { AppDataSource } from '../config/database';

export class CustomerRepository extends BaseRepository<Customer> {
  private static instance: CustomerRepository;

  private constructor() {
    super(Customer);
  }

  static getInstance(): CustomerRepository {
    if (!CustomerRepository.instance) {
      CustomerRepository.instance = new CustomerRepository();
    }
    return CustomerRepository.instance;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customers = await this.findByCriteria({ email } as Partial<Customer>);
    return customers[0] || null;
  }
}