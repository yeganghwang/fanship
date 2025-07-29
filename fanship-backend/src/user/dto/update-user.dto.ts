import { IsString, IsOptional, IsNumber, IsEnum, MaxLength, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// 빈 문자열을 허용하는 URL 검증 데코레이터
function IsUrlOrEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUrlOrEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === '' || value === null || value === undefined) {
            return true; // 빈 문자열, null, undefined는 허용
          }
          if (typeof value !== 'string') {
            return false;
          }
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid URL or empty string`;
        },
      },
    });
  };
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MaxLength(12)
  nickname?: string;



  @IsUrlOrEmpty()
  @IsOptional()
  pfp_img_url?: string | null;

  @IsUrlOrEmpty()
  @IsOptional()
  ig_url?: string | null;

  @IsNumber()
  @IsOptional()
  company_id?: number;

  @IsString()
  @IsOptional()
  celeb_type?: string;
}