import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { Deposit } from './entities/deposit.entity';
import { DepositStatus } from './enums/deposit-status.enum';

@Injectable()
export class DepositsRepository extends Repository<Deposit> {
  private logger = new Logger('DepositsRepository');

  constructor(
    private dataSource: DataSource,
    private usersRepository: UsersRepository,
  ) {
    super(Deposit, dataSource.createEntityManager());
  }

  async updateUserDeposit(
    amount: number,
    type: DepositStatus,
    user: User,
  ): Promise<User> {
    const currentUser = await this.usersRepository.findOneBy({ id: user.id });

    if (type == DepositStatus.ADD) {
      currentUser.deposit = currentUser.deposit + amount;
    } else if (type == DepositStatus.DEDUCT) {
      if (currentUser.deposit == 0) {
        throw new Error("can't process deposit balance is zero");
      }
      if (currentUser.deposit < amount) {
        throw new Error("can't process to deduct from the deposit balance");
      }
      currentUser.deposit = currentUser.deposit - amount;
    }

    return currentUser;
  }

  async createDeposit(
    amount: number,
    type: DepositStatus,
    user: User,
    desc: string = null,
  ): Promise<Deposit> {
    const deposit = this.create();
    deposit.user = user;
    deposit.amount = amount;
    deposit.type = type;
    deposit.after = user.deposit;

    if (type == DepositStatus.ADD) {
      deposit.before = deposit.after - amount;
    } else {
      deposit.before = deposit.after + amount;
    }
    deposit.description = desc;

    return deposit;
  }
}
