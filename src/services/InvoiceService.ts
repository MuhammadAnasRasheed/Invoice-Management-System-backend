import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ShopRepository } from '../repositories/ShopRepository';
import { Invoice, InvoiceStatus } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItems';
import { generateInvoiceNumber } from '../utils/invoiceHelper';
import { User } from '../entities/User';
import { AppDataSource } from '../config/database';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private customerRepository: CustomerRepository;
  private shopRepository: ShopRepository;

  constructor(
    invoiceRepo?: InvoiceRepository,
    customerRepo?: CustomerRepository,
    shopRepo?: ShopRepository
  ) {
    // Dependency Injection
    this.invoiceRepository = invoiceRepo || InvoiceRepository.getInstance();
    this.customerRepository = customerRepo || CustomerRepository.getInstance();
    this.shopRepository = shopRepo || ShopRepository.getInstance();
  }

  async createInvoice(data: {
    customerId: number | string;
    userId: number | string;
    shopId?: number | string;
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
    issueDate: Date;
    dueDate: Date;
    tax?: number;
    discount?: number;
    notes?: string;
  }): Promise<Invoice> {
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const total = subtotal + tax - discount;

    const invoiceNumber = await generateInvoiceNumber();

    const invoiceItems = data.items.map(item => {
      const invoiceItem = new InvoiceItem();
      invoiceItem.description = item.description;
      invoiceItem.quantity = item.quantity;
      invoiceItem.unitPrice = item.unitPrice;
      invoiceItem.total = item.quantity * item.unitPrice;
      return invoiceItem;
    });

    const numericCustomerId = typeof data.customerId === 'string' ? Number(data.customerId) : data.customerId;
    const customer = await this.customerRepository.findById(numericCustomerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const numericUserId = typeof data.userId === 'string' ? Number(data.userId) : data.userId;

    const invoice = new Invoice();
    invoice.invoiceNumber = invoiceNumber;
    invoice.customer = customer;
    invoice.user = { id: numericUserId } as User;
    invoice.issueDate = data.issueDate;
    invoice.dueDate = data.dueDate;
    invoice.subtotal = subtotal;
    invoice.tax = tax;
    invoice.discount = discount;
    invoice.total = total;
    invoice.notes = data.notes ?? "";
    invoice.items = invoiceItems;
    invoice.status = InvoiceStatus.PENDING;

    if (data.shopId) {
      const numericShopId = typeof data.shopId === 'string' ? Number(data.shopId) : data.shopId;
      const shop = await this.shopRepository.findById(numericShopId);
      if (shop) {
        invoice.shop = shop;
      }
    }

    return await this.invoiceRepository.create(invoice);
  }

  async getAllInvoices(userId: number | string, search?: string, shopId?: number | string): Promise<Invoice[]> {
    return await this.invoiceRepository.findAllWithDetails(userId, search, shopId);
  }

  async getInvoiceById(id: number | string): Promise<Invoice | null> {
    return await this.invoiceRepository.getInvoiceById(id);
  }

  async getInvoicesByCustomer(customerId: number | string, userId: number | string): Promise<Invoice[]> {
    return await this.invoiceRepository.findByCustomer(customerId, userId);
  }

  async updateInvoiceStatus(id: number | string, status: InvoiceStatus): Promise<Invoice> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const invoice = await this.invoiceRepository.findById(numericId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return await this.invoiceRepository.update(numericId, { status });
  }

  async deleteInvoice(id: number | string): Promise<boolean> {
    try {
      const numericId = typeof id === 'string' ? Number(id) : id;
      // First, manually delete all invoice items
      await AppDataSource.getRepository(InvoiceItem).delete({ invoice: { id: numericId } });

      // Then delete the invoice
      const result = await this.invoiceRepository.delete(numericId);

      return result;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
}
