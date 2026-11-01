import { BaseRepository } from './BaseRepository';
import { Customer } from '../entities/Customer';
import { ILike, Like } from 'typeorm';

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

  async findByUser(userId: number | string, search?: string, shopId?: number | string): Promise<Customer[]> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;
    const where: any = {
      user: { id: numericUserId }
    };

    if (shopId && String(shopId) !== 'all') {
      where.shop = { id: Number(shopId) };
    }

    if (search && search.trim() !== '') {
      where.name = ILike(`%${search}%`);
    }

    return await this.repository.find({
      where,
      relations: ['shop'],
      order: { createdAt: 'DESC' }
    });
  }

  async searchByName(userId: number | string, searchTerm: string): Promise<Customer[]> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;
    return await this.repository.find({
      where: {
        user: { id: numericUserId },
        name: Like(`%${searchTerm}%`)
      } as any,
      relations: ['shop'],
      order: { name: 'ASC' }
    });
  }

  async findByIdWithUser(id: number | string): Promise<Customer | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return await this.repository.findOne({
      where: { id: numericId } as any,
      relations: ['user', 'shop']
    });
  }
}
