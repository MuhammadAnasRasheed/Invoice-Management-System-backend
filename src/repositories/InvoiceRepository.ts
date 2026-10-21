import { BaseRepository } from './BaseRepository';
import { Invoice } from '../entities/Invoice';
import { ILike } from 'typeorm';

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

  async findAllWithDetails(userId: number | string, search?: string): Promise<Invoice[]> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    if (search && search.trim() !== '') {
      return await this.repository.find({
        where: {
          user: { id: numericUserId },
          invoiceNumber: ILike(`%${search}%`)
        },
        relations: ['customer', 'items'],
        order: { createdAt: 'DESC' }
      });
    }

    return await this.repository.find({
      where: {
        user: { id: numericUserId },
      },
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByCustomer(customerId: number | string, userId: number | string): Promise<Invoice[]> {
    const numericCustomerId = typeof customerId === 'string' ? Number(customerId) : customerId;
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    return await this.repository.find({
      where: {
        customer: { id: numericCustomerId },
        user: { id: numericUserId }
      } as any,
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async getInvoiceById(id: number | string): Promise<Invoice | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return await this.repository.findOne({
      where: { id: numericId } as any,
      relations: ['customer', 'items', 'user'],
    });
  }
}
