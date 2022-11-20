import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities/product.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: 'buyer' })
  role: string;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  public deposit!: number;

  @OneToMany((type) => Product, (product) => product.user, { eager: true })
  products: Product[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
