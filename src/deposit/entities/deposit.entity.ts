import { User } from 'src/users/entities/user.entity';
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
import { DepositStatus } from '../enums/deposit-status.enum';

@Entity()
export class Deposit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.orders, { eager: false })
  user: User;

  @Column()
  type: DepositStatus;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  before: number;

  @Column()
  after: number;
  
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;
}
