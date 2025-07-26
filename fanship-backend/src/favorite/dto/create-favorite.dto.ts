import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsInt()
  celebId?: number;
}
