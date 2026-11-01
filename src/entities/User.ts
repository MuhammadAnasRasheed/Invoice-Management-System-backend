import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Invoice } from './Invoice';
import { Customer } from './Customer';
import { Shop } from './Shops';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp',nullable: true })
  updatedAt!: Date|null;

  @Column({ type: 'integer', nullable: true })
  updatedBy!: number | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'integer', nullable: true })
  deletedBy!: number | null;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices!: Invoice[];

  @OneToMany(() => Customer, (customer) => customer.user)
  customers!: Customer[];

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops!: Shop[];
}
