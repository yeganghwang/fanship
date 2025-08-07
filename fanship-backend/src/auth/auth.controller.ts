import { Controller, Post, Body, HttpCode, HttpStatus, Headers, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Google reCAPTCHA 검증 함수
  async verifyRecaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) throw new Error('reCAPTCHA secret key not set');
    try {
      const res = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret,
            response: token,
          },
        }
      );
      return res.data.success;
    } catch (err) {
      return false;
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto & { recaptchaToken?: string }): Promise<User> {
    if (!createUserDto.recaptchaToken || !(await this.verifyRecaptcha(createUserDto.recaptchaToken))) {
      throw new UnauthorizedException('reCAPTCHA 검증 실패');
    }
    return this.authService.register(createUserDto);
  }

  @Post('login')  
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto & { recaptchaToken?: string }) {
    if (!loginUserDto.recaptchaToken || !(await this.verifyRecaptcha(loginUserDto.recaptchaToken))) {
      throw new UnauthorizedException('reCAPTCHA 검증 실패');
    }
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    
    const token = authHeader.substring(7); // 'Bearer ' 제거
    return this.authService.logout(token);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @Post('password-reset-request')
  @HttpCode(HttpStatus.OK)
  async passwordResetRequest(@Body() passwordResetRequestDto: PasswordResetRequestDto) {
    return this.authService.passwordResetRequest(passwordResetRequestDto.mail);
  }

  @Post('password-reset-confirm')
  @HttpCode(HttpStatus.OK)
  async passwordResetConfirm(@Body() passwordResetConfirmDto: PasswordResetConfirmDto) {
    return this.authService.passwordResetConfirm(passwordResetConfirmDto.token, passwordResetConfirmDto.new_password);
  }
}
