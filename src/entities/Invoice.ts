import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Customer } from './Customer';
import { InvoiceItem } from './InvoiceItems';
import { Shop } from './Shops';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  invoiceNumber!: string;

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status!: InvoiceStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @ManyToOne(() => User, (user) => user.invoices)
  user!: User;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer!: Customer;

  @ManyToOne(() => Shop, (shop) => shop.invoices, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shop_id' })
  shop?: Shop | null;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items!: InvoiceItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}