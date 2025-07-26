import { IsString, IsNotEmpty, MaxLength, IsIn } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(127)
  company_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  company_type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  region: string;
}