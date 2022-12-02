import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { DepositsRepository } from './deposits.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Deposit]), UsersModule],
  controllers: [DepositController],
  providers: [
    UsersRepository,
    DepositsRepository,
    DepositService,
  ],
})
export class DepositModule {}
