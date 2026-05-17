import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Customer } from './Customer';
import { InvoiceItem } from './InvoiceItems';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true})
  items!: InvoiceItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}