import { IsInt, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @IsOptional()
  @IsInt()
  company_id?: number;

  @IsOptional()
  @IsInt()
  celeb_id?: number;
}
