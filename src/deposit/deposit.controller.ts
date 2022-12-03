import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../users/get-user.decorator';
import { BuyerRoleGuard } from '../users/gurds/buyer.gurad';
import { DepositService } from './deposit.service';
import { DepositDto } from './dto/deposit.dto';

@Controller('deposit')
@UseGuards(AuthGuard(), BuyerRoleGuard)
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('/add')
  addDeposit(
    @Body(ValidationPipe) depositDto: DepositDto,
    @GetUser() user: User,
  ) {
    return this.depositService.addDeposit(depositDto, user);
  }

  @Post('/reset')
  resetDeposit(@GetUser() user: User) {
    return this.depositService.reset(user);
  }
}
