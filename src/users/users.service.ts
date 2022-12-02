import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(
      {
        id: user.id,
      },
      {
        ...updateUserDto,
      },
    );
  }

  async remove(user: User) {
       const item = await this.findOne(user.id);
       item.softRemove();
  }
}
