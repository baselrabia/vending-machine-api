import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';
import { User } from '../users/entities/user.entity';
import { Order } from './entities/order.entity';
 import { DataSource } from 'typeorm';
import { DepositService } from '../deposit/deposit.service';

@Injectable()
export class OrdersService {
  private logger = new Logger('OrdersService');

  constructor(
    private dataSource: DataSource,
    private ordersRepository: OrdersRepository,
    private depositService: DepositService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    // get a connection and create a new query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();
    let order = null;
    try {
      order = await this.ordersRepository.createOrder(
        queryRunner.manager,
        createOrderDto,
        user,
      );

      const seller = await queryRunner.manager.findOne(User, {
        where: { id: order.product.seller_id },
      });

      console.log('Order-------', seller);
      console.log('user-------', user);

      const AddBuyerDeposit = await this.depositService.add(
        queryRunner,
        order.getTotal(),
        seller,
        'purchase order #' + order.id,
      );

      const deductDeposit = await this.depositService.deduct(
        queryRunner,
        order.getTotal(),
        user,
        'purchase order #' + order.id,
      );

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

    return order;
  }

  async findAll(user: User) {
    return await this.ordersRepository.find({
      where: { buyer_id: user.id },
    });
  }

  async findOne(id: number, user: User): Promise<Order> {
    const item = await this.ordersRepository.findOne({
      where: { id: id },
      loadEagerRelations: false,
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (!(item.buyer_id == user.id || item.product.seller_id == user.id)) {
      throw new UnauthorizedException(
        `Task with ID "${id}" not authorized to be shown`,
      );
    }

    item['total'] = item.getTotal();

    return item;
  }

  async findAllBought(user: User) {
    return await this.ordersRepository.find({
      where: {
        product: {
          seller_id: user.id,
        },
      },
    });
  }
}
