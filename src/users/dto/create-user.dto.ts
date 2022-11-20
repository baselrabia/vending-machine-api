 import {
   IsIn,IsString,
   MinLength,
   MaxLength,
   Matches,
   equals,
 } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsIn(['buyer', 'seller'])
  role: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
