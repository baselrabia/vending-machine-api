import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
