import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLoginLogDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}
