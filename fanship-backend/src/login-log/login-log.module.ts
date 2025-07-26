import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLogService } from './login-log.service';
import { LoginLogController } from './login-log.controller';
import { LoginLog } from './login-log.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginLog]),
    UserModule,
  ],
  providers: [LoginLogService],
  controllers: [LoginLogController],
})
export class LoginLogModule {}
