import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateGoodsDto } from './create-goods.dto';

export class UpdateGoodsDto extends PartialType(CreateGoodsDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsBoolean()
  @IsOptional()
  sold?: boolean;
}