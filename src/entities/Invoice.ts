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

  @Column()
  invoiceNumber!: string;

  @Column('date')
  issueDate!: Date;

  @Column('date')
  dueDate!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING
  })
  status!: InvoiceStatus;

  @Column({ nullable: true })
  notes!: string;

  @ManyToOne(() => User, (user) => user.invoices)
  user!: User;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer!: Customer;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items!: InvoiceItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}