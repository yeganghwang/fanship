import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @IsOptional()
  writerId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsBoolean()
  notice?: boolean;
}
