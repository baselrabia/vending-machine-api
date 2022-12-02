import {
  IsIn,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  equals,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
}
