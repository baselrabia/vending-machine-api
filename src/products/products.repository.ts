import { CreateProductDto } from './dto/create-product.dto';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { ProductStatus } from './entities/product-status.enum';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  private logger = new Logger('ProductsRepository');

  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { name, amount, price } = createProductDto;

    const product = this.create();
    product.name = name;
    product.amount = parseInt(amount);
    product.price = parseFloat(price);
    product.status = ProductStatus.AVAILABLE;
    product.user = user;

    try {
      await product.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a product for user "${
          user.username
        }". Data: ${JSON.stringify(createProductDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete product.user;

    return product;
  }
}
