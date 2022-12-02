 import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { DepositsRepository } from './deposits.repository';
import { DepositDto } from './dto/deposit.dto';
import { DepositStatus } from './enums/deposit-status.enum';
 
@Injectable()
export class DepositService {
  private logger = new Logger('DepositService');

  constructor(
    private dataSource: DataSource,
    private depositsRepository: DepositsRepository,
  ) {}

  async addDeposit(depositDto: DepositDto, user: User) {
    return this.addWithTransaction(depositDto.coins, user, 'add deposit Api');
  }

  async reset(user: User) {
    return this.deductWithTransaction(user.deposit, user, 'reset deposit');
  }

  async addWithTransaction(amount: number, user: User, desc: string) {
    return this.createDepositTransaction(amount, DepositStatus.ADD, user, desc);
  }

  async deductWithTransaction(amount: number, user: User, desc: string) {
    return this.createDepositTransaction(
      amount,
      DepositStatus.DEDUCT,
      user,
      desc,
    );
  }

  async add(
    queryRunner: QueryRunner,
    amount: number,
    user: User,
    desc: string,
  ) {
    return this.createDeposit(
      queryRunner,
      amount,
      DepositStatus.ADD,
      user,
      desc,
    );
  }

  async deduct(
    queryRunner: QueryRunner,
    amount: number,
    user: User,
    desc: string,
  ) {
    return this.createDeposit(
      queryRunner,
      amount,
      DepositStatus.DEDUCT,
      user,
      desc,
    );
  }
  async createDeposit(
    queryRunner: QueryRunner,
    amount: number,
    type: DepositStatus,
    user: User,
    desc: string,
  ) {
    const currentUser = await this.depositsRepository.updateUserDeposit(
      amount,
      type,
      user,
    );

    await queryRunner.manager.save(currentUser);

    const deposit = await this.depositsRepository.createDeposit(
      amount,
      type,
      currentUser,
      desc,
    );
    await queryRunner.manager.save(deposit);
  }

  async createDepositTransaction(
    amount: number,
    type: DepositStatus,
    user: User,
    desc: string,
  ) {
    // get a connection and create a new query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    // await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await this.createDeposit(queryRunner, amount, type, user, desc);
      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Failed Request for user "${user.username}". Error: ${JSON.stringify(
          err.message,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
