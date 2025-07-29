import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString, IsInt, MinLength, MaxLength, IsIn, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['fan', 'celeb']) // 허용된 값 목록 추가
  position: string; // fan, celeb

  @IsOptional()
  @IsDateString()
  dob?: string | null; // null 허용

  @IsOptional()
  @IsString()
  ig_url?: string | null; // null 허용

  @IsOptional()
  @IsString()
  pfp_img_url?: string | null; // null 허용

  @ValidateIf(o => o.position === 'celeb')
  @IsOptional() // null 허용
  @IsInt()
  company_id?: number | null;

  @ValidateIf(o => o.position === 'celeb')
  @IsOptional() // null 허용
  @IsString()
  celeb_type?: string | null;
}
