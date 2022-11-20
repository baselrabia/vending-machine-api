import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(CreateUserDto: CreateUserDto): Promise<void> {
    const { username,role, password } = CreateUserDto;
    console.log('role');

    const user = this.create();
    user.username = username;
    user.role = role;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOneBy({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }  
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
