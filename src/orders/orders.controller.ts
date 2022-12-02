import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { BuyerRoleGuard } from 'src/users/gurds/buyer.gurad';
import { SellerRoleGuard } from 'src/users/gurds/seller.gurad';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(BuyerRoleGuard)
  create(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(BuyerRoleGuard)
  findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get('/bought')
  @UseGuards(SellerRoleGuard)
  findAllBought(@GetUser() user: User) {
    return this.ordersService.findAllBought(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.ordersService.findOne(+id, user);
  }
}


