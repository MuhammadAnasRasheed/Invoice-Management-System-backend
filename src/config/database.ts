import { DataSource } from 'typeorm';
import { Invoice } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItems';
import { Customer } from '../entities/Customer';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [Invoice, InvoiceItem, Customer, User],
  subscribers: [],
  migrations: [],
  ssl: {
    rejectUnauthorized: false,
  },
});