import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { ProductsRepository } from '../products/products.repository';
import { DepositService } from '../deposit/deposit.service';
import { DepositsRepository } from '../deposit/deposits.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule],
  controllers: [OrdersController],
  providers: [
    ProductsRepository,
    OrdersRepository,
    UsersRepository,
    DepositsRepository,
    DepositService,
    OrdersService,
  ],
})
export class OrdersModule {}
