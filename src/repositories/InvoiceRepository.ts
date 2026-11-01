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

  async findAllWithDetails(userId: number | string, search?: string, shopId?: number | string): Promise<Invoice[]> {
    const numericUserId = typeof userId === 'string' ? Number(userId) : userId;

    const where: any = {
      user: { id: numericUserId },
    };

    if (shopId && String(shopId) !== 'all') {
      where.customer = { shop: { id: Number(shopId) } };
    }

    if (search && search.trim() !== '') {
      where.invoiceNumber = ILike(`%${search}%`);
    }

    return await this.repository.find({
      where,
      relations: ['customer', 'customer.shop', 'items'],
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
      relations: ['customer', 'customer.shop', 'items'],
      order: { createdAt: 'DESC' }
    });
  }

  async getInvoiceById(id: number | string): Promise<Invoice | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return await this.repository.findOne({
      where: { id: numericId } as any,
      relations: ['customer', 'customer.shop', 'items']
    });
  }
}
