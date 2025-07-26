import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginLog } from './login-log.entity';
import { CreateLoginLogDto } from './dto/create-login-log.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog)
    private loginLogRepository: Repository<LoginLog>,
    private userService: UserService,
  ) {}

  async createLoginLog(createLoginLogDto: CreateLoginLogDto): Promise<LoginLog> {
    const user = await this.userService.findOneByUserId(createLoginLogDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${createLoginLogDto.userId} not found`);
    }

    const newLoginLog = this.loginLogRepository.create(createLoginLogDto);
    return this.loginLogRepository.save(newLoginLog);
  }
}
