import { BaseRepository } from './BaseRepository';
import { Customer } from '../entities/Customer';

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

  async findByUser(userId: string): Promise<Customer[]> {
    return await this.repository.find({
      where: { user: { id: userId } } as any,
      order: { createdAt: 'DESC' }
    });
  }

  async findByIdWithUser(id: string): Promise<Customer | null> {
    return await this.repository.findOne({
      where: { id } as any,
      relations: ['user']
    });
  }
}