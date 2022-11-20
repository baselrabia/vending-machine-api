import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { JwtStrategy } from './jwt/jwt.strategy';
 
const jwtConfig = config.get('jwt');
 
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersRepository, UsersService, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
