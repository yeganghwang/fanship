import { IsString, IsOptional, IsUrl, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MaxLength(12)
  nickname?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsUrl()
  @IsOptional()
  pfp_img_url?: string;

  @IsUrl()
  @IsOptional()
  ig_url?: string;

  @IsNumber()
  @IsOptional()
  company_id?: number;

  @IsString()
  @IsOptional()
  celeb_type?: string;
}