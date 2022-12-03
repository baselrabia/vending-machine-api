import { HttpStatus, INestApplication } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { User } from '../src/users/entities/user.entity';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UsersModule } from '../src/users/users.module';
import { AuthService } from '../src/users/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService = { signIn: () => ['test'], signUp:()  => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  const mockUser = {
    username: 'username',
    password: 'password',
    role: 'seller',
  };

  describe('/auth/signup (POST)', () => {
    it('it should register a user and return the new user object', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect(200)
        .expect({
          data: authService.signUp(),
        });
        // .expect((response: request.Response) => {
        //   const { id, username, password, role } = response.body;

        //   expect(typeof id).toBe('number'),
        //     expect(username).toEqual(mockUser.username),
        //     expect(password).toBeUndefined();
        //   expect(role).toEqual(mockUser.role);
        // })
    });
  });

//    describe('/api/auth/signup (POST)', () => {
//      it('it should register a user and return the new user object', () => {
//        return (
//          request(app.getHttpServer())
//            .post('/auth/signup')
//            .set('Accept', 'application/json')
//            .send(mockUser)
//            // .expect((response: request.Response) => {
//            //   const { id, username, password, role } = response.body;

//            //   expect(typeof id).toBe('number'),
//            //     expect(username).toEqual(mockUser.username),
//            //     expect(password).toBeUndefined();
//            //   expect(role).toEqual(mockUser.role);
//            // })
//            .expect(HttpStatus.CREATED)
//        );
//      });
//    });
});
