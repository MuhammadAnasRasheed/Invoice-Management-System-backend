import { BaseRepository } from './BaseRepository';
import { Invoice } from '../entities/Invoice';
import { AppDataSource } from '../config/database';

export class InvoiceRepository extends BaseRepository<Invoice> {
  private static instance: InvoiceRepository;

  private constructor() {
    super(Invoice);
  }

  // Singleton Pattern
  static getInstance(): InvoiceRepository {
    if (!InvoiceRepository.instance) {
      InvoiceRepository.instance = new InvoiceRepository();
    }
    return InvoiceRepository.instance;
  }

  async findWithDetails(id: string): Promise<Invoice | null> {
    return await this.repository.findOne({
      where: { id } as any,
      relations: ['customer', 'items', 'user']
    });
  }

  async findAllWithDetails(): Promise<Invoice[]> {
    return await this.repository.find({
      relations: ['customer', 'items', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    return await this.repository.find({
      where: { customer: { id: customerId } } as any,
      relations: ['items']
    });
  }
}