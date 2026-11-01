import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './Invoice';
import { User } from './User';
import { Shop } from './Shops';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 15 })
  phone!: string;

  @Column({ type: 'text' })
  address!: string;

  @ManyToOne(() => User, (user) => user.customers)
  user!: User;

  @ManyToOne(() => Shop, (shop) => shop.customers, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shop_id' })
  shop?: Shop | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices!: Invoice[];
}
