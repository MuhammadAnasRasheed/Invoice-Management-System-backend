import { BaseRepository } from './BaseRepository';
import { Customer } from '../entities/Customer';
import { ILike,Like } from 'typeorm';

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

  async findByUser(userId: string, search: string): Promise<Customer[]> {
  if (search) {
    return await this.repository.find({
      where: {
        user: { id: userId },
        name: ILike(`%${search}%`)
      }
    });
  }

  return await this.repository.find({
    where: {
      user: { id: userId }
    }
  });
}

  async searchByName(userId: string, searchTerm: string): Promise<Customer[]> {
    return await this.repository.find({
      where: {
        user: { id: userId },
        name: Like(`%${searchTerm}%`)
      } as any,
      order: { name: 'ASC' }
    });
  }

  async findByIdWithUser(id: string): Promise<Customer | null> {
    return await this.repository.findOne({
      where: { id } as any,
      relations: ['user']
    });
  }
}