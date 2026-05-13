import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Invoice } from './Invoice';
import { User } from './User';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({unique:true})
  email!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  gstNumber!: string;

  @ManyToOne(() => User, (user) => user.customers)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices!: Invoice[];
}