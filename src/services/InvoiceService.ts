import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { Invoice, InvoiceStatus } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItems';
import { generateInvoiceNumber } from '../utils/invoiceHelper';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private customerRepository: CustomerRepository;

  constructor(
    invoiceRepo?: InvoiceRepository,
    customerRepo?: CustomerRepository
  ) {
    // Dependency Injection
    this.invoiceRepository = invoiceRepo || InvoiceRepository.getInstance();
    this.customerRepository = customerRepo || CustomerRepository.getInstance();
  }

  async createInvoice(data: {
    customerId: string;
    userId: string;
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

    const customer = await this.customerRepository.findById(data.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const invoice = new Invoice();
    invoice.invoiceNumber = invoiceNumber;
    invoice.customer = customer;
    invoice.issueDate = data.issueDate;
    invoice.dueDate = data.dueDate;
    invoice.subtotal = subtotal;
    invoice.tax = tax;
    invoice.discount = discount;
    invoice.total = total;
    invoice.notes = data.notes ?? ""; // Keep existing if undefined
    invoice.items = invoiceItems;
    invoice.status = InvoiceStatus.PENDING;

    return await this.invoiceRepository.create(invoice);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.invoiceRepository.findAllWithDetails();
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return await this.invoiceRepository.findWithDetails(id);
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return await this.invoiceRepository.update(id, { status });
  }

  async deleteInvoice(id: string): Promise<boolean> {
    return await this.invoiceRepository.delete(id);
  }

  async getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.findByCustomer(customerId);
  }
}