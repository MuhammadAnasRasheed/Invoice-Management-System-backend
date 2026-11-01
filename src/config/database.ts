import { DataSource } from 'typeorm';
import { Invoice } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItems';
import { Customer } from '../entities/Customer';
import { User } from '../entities/User';
import dotenv from 'dotenv';
import { Shop } from '../entities/Shops';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true, // Development only
  logging: false,

  entities: [Invoice, InvoiceItem, Customer, User,Shop],
  subscribers: [],
  migrations: [],

  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});