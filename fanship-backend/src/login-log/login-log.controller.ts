import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { CreateLoginLogDto } from './dto/create-login-log.dto';
import { LoginLog } from './login-log.entity';

@Controller('logins')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLoginLog(@Body() createLoginLogDto: CreateLoginLogDto): Promise<LoginLog> {
    return this.loginLogService.createLoginLog(createLoginLogDto);
  }
}
