import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCelebDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  companyId?: number | null;

  @IsString()
  @IsOptional()
  celebType?: string | null;
}

export class UpdateCelebDto {
  @IsNumber()
  @IsOptional()
  companyId?: number;

  @IsString()
  @IsOptional()
  celebType?: string;
}