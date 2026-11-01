import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn
} from 'typeorm';

import { User } from './User';
import { Customer } from './Customer';
import { Invoice } from './Invoice';

@Entity('shops')
export class Shop {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    address!: string;

    @Column({ type: 'varchar', length: 100 })
    city!: string;

    @Column({ type: 'varchar', length: 100 })
    country!: string;

    @ManyToOne(() => User, (user) => user.shops, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'owner_id' })
    owner!: User;

@OneToMany(() => Customer, (customer) => customer.shop)
  customers!: Customer[];

  @OneToMany(() => Invoice, (invoice) => invoice.shop)
  invoices!: Invoice[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @Column({ type: 'integer' })
    createdBy!: number;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt!: Date | null;

    @Column({ type: 'integer', nullable: true })
    updatedBy?: number | null;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date | null;

    @Column({ type: 'integer', nullable: true })
    deletedBy?: number | null;
}
