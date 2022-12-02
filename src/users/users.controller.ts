import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

  @UseGuards(AuthGuard())
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
      return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }

    @Put()
    update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(user, updateUserDto);
    }

    @Delete()
    remove(@GetUser() user: User) {
      return this.usersService.remove(user);
    }
  }
