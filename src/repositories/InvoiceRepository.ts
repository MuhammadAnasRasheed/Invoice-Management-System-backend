import { BaseRepository } from './BaseRepository';
import { Invoice } from '../entities/Invoice';
import { AppDataSource } from '../config/database';
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


  async findAllWithDetails(userId: string, search?: string): Promise<Invoice[]> {
  if (search && search.trim() !== '') {
    return await this.repository.find({
      where: {
        user: { id: userId },
        invoiceNumber: ILike(`%${search}%`)
      },
      relations: ['customer', 'items'], 
      order: { createdAt: 'DESC' }
    });
  }

  return await this.repository.find({
    where: {
      user: { id: userId },
    },
    relations: ['customer', 'items'],
    order: { createdAt: 'DESC' }
  });
}

  async findByCustomer(customerId: string, userId: string): Promise<Invoice[]> {
  return await this.repository.find({
    where: { 
      customer: { id: customerId },
      user: { id: userId }  // ✅ Add user filter
    } as any,
    relations: ['items'],
    order: { createdAt: 'DESC' }
  });
}

  async getInvoiceById(id: string): Promise<Invoice | null> {
  return await this.repository.findOne({
    where: { id } as any,
    relations: ['customer', 'items', 'user'],  // ✅ Fetches customer, items, and user
  });
}
}