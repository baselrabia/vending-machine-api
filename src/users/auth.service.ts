import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(CreateUserDto: CreateUserDto): Promise<void> {
    return this.usersRepository.signUp(CreateUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.usersRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
