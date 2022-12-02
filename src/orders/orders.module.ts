import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { DepositService } from 'src/deposit/deposit.service';
import { DepositsRepository } from 'src/deposit/deposits.repository';
import { UsersRepository } from 'src/users/users.repository';


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
