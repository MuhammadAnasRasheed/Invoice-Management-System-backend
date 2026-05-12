import { AppDataSource } from '../config/database';
import { Invoice } from '../entities/Invoice';

export const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await AppDataSource.getRepository(Invoice).count();
  const sequence = String(count + 1).padStart(6, '0');
  return `INV-${year}-${sequence}`;
};