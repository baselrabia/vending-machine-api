import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductStatus } from './product-status.enum';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  price: number;

  @Column()
  status: ProductStatus;

  @ManyToOne((type) => User, (user) => user.products, { eager: false })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany((type) => Order, (order) => order.product, { eager: false })
  @JoinColumn({ name: 'Order_id' })
  orders: Order[];

  @Column()
  seller_id: number;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;
}
