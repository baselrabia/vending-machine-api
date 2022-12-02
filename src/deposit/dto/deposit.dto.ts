import { IsNumber, IsEnum } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @IsEnum(
    { 5: 5, 10: 10, 20: 20, 50: 50, 100: 100 },
    {
      message: (args) => "coins must be a valid value, can't be " + args.value,
    },
  )
  coins: number;
}
