import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
 
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.orders, { eager: false })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne((type) => Product, (product) => product.orders, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  buyer_id: number;

  @Column()
  product_id: number;

  @Column()
  amount: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  price: number;

  @Column()
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  getTotal() {
    return this.price * this.amount;
  }
}
