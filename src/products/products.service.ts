import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './entities/product-status.enum';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto, user: User) {
    return this.productsRepository.createProduct(createProductDto, user);
  }

  async findAll() {
    return this.productsRepository.find({
      where: { status: ProductStatus.AVAILABLE },
    });
  }

  async findOne(id: number): Promise<Product> {
    const item = await this.productsRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return item;
  }

  async getProductById(id: number, user: User): Promise<Product> {
    const item = await this.findOne(id);
    if (item.seller_id !== user.id) {
      throw new UnauthorizedException(
        `Task with ID "${id}" not authorized to be modified`,
      );
    }
    return item;
  }


  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.getProductById(id, user);

    await this.productsRepository.update(
      {
        id: id,
        seller_id: user.id,
      },
      {
        ...updateProductDto,
      },
    );
  }

  async remove(id: number, user: User) {
    const item = await this.getProductById(id, user);
    item.softRemove();
  }
}
