import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordResetRequestDto {
  @IsEmail()
  @IsNotEmpty()
  mail: string;
}

export class PasswordResetConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  new_password: string;
}