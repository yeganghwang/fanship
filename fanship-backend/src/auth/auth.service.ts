import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CelebService } from '../celeb/celeb.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private celebService: CelebService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, mail, nickname, password, ig_url, dob, pfp_img_url, position, company_id, celeb_type } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [
        { username },
        { mail },
        { nickname },
        ...(ig_url !== null && ig_url !== undefined ? [{ ig_url }] : []),
      ],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.mail === mail) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.nickname === nickname) {
        throw new ConflictException('Nickname already exists');
      }
      if (existingUser.ig_url && existingUser.ig_url === ig_url) {
        throw new ConflictException('Instagram URL already exists');
      }
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      throw new InternalServerErrorException('Failed to hash password');
    }

    const parsedDob = dob ? new Date(dob) : null;

    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.mail = mail;
    user.nickname = nickname;
    user.position = position;
    user.dob = parsedDob;
    user.ig_url = ig_url === undefined ? null : ig_url;
    user.pfp_img_url = pfp_img_url === undefined ? null : pfp_img_url;

    const savedUser = await this.usersRepository.save(user);

    if (position === 'celeb') {
      if (company_id === undefined || celeb_type === undefined) {
        throw new BadRequestException('company_id and celeb_type are required for celeb position');
      }
      await this.celebService.createCeleb({ userId: savedUser.userId, companyId: company_id, celebType: celeb_type });
    }

    return savedUser; // Let ClassSerializerInterceptor handle transformation
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
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

  async logout(token: string): Promise<{ message: string }> {
    // 현재는 토큰 블랙리스트를 지원하지 않으므로 성공 응답만 반환
    // 향후 토큰 블랙리스트 기능 구현 시 여기에 로직 추가
    return {
      message: 'Successfully logged out'
    };
  }
}
