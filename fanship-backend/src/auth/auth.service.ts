import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    console.log('User found:', user);
    if (user && (await bcrypt.compare(pass, user.password))) {
      console.log('Password comparison successful.');
      const { password, ...result } = user;
      return result;
    }
    console.log('Password comparison failed or user not found.');
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.username, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.userId };
    let accessToken;
    try {
      accessToken = this.jwtService.sign(payload);
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate access token');
    }
    return {
      access_token: accessToken,
      user_id: user.userId,
    };
  }
}
