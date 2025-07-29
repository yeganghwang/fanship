import { Controller, Post, Body, HttpCode, HttpStatus, Headers, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')  
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
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
