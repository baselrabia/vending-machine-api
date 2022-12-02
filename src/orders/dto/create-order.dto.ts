import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
  
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
