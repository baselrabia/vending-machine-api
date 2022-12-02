import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/database.config';
import { OrdersModule } from './orders/orders.module';
import { DepositModule } from './deposit/deposit.module';
 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsersModule,
    ProductsModule,
    OrdersModule,
    DepositModule,
  ],
})
export class AppModule {}
