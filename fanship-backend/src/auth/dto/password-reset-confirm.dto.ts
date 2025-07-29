import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class PasswordResetConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
} 