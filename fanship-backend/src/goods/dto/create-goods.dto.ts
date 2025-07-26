import { IsString, IsNotEmpty, IsNumber, IsInt, Min, MaxLength } from 'class-validator';

export class CreateGoodsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  amount: number;
}
