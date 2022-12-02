import { ProductsRepository } from './../products/products.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  private logger = new Logger('OrdersRepository');

  constructor(
    private dataSource: DataSource,
    private productsRepository: ProductsRepository,
  ) {
    super(Order, dataSource.createEntityManager());
  }

  async createOrder(
     transactionManager: EntityManager,
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    const { amount, product_id } = createOrderDto;

    const order = this.create();
    order.amount = amount;
    order.buyer = user;
    order.status = OrderStatus.PENDING;

    try {
      const product = await this.productsRepository.findOne({
        where: { id: product_id },
      });

      order.product = product;
      order.price = product.price;


      await transactionManager.save(order);
    } catch (error) {
      this.logger.error(
        `Failed to create a order for user "${
          user.username
        }". Data: ${JSON.stringify(createOrderDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete order.buyer;
    order['total'] = order.getTotal();

    return order;
  }
}
