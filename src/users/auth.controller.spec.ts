import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let authController: AuthController;
  let authSrv: AuthService;
  const mockAuthService = {
    signUp: jest.fn().mockImplementation((CreateUserDto: CreateUserDto) => {
      return {
        id : 123,
        ...CreateUserDto
      };
    }),
    signIn: () => null,
  };

  const usersRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports:[PassportModule],
      controllers: [AuthController],
      providers: [
        UsersService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersRepository,
          useValue: usersRepo,
        },
      ],
    }).compile();

    authController = await module.get<AuthController>(AuthController);
    authSrv = await module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should add new user to the database', async () => {
      let data = new CreateUserDto();
      data = {
        username: 'ahmed',
        password: '123456',
        role: 'seller',
      };
      const res = await authController.signUp(data);
      console.log('RESult', res);

      expect(res).toHaveProperty("username")
      console.log(authController);
    });
  });

  describe('signIn', () => {
    it('should sign in user, if credentials valid', async () => {});
  });
});
