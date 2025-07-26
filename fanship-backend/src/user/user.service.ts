import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CelebService } from '../celeb/celeb.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private celebService: CelebService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, mail, nickname, password, ig_url, dob, pfp_img_url, position, company_id, celeb_type } = createUserDto; // 필드 추가

    // 중복 사용자 확인
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

    // 비밀번호 해싱
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      throw new InternalServerErrorException('Failed to hash password');
    }

    // dob (string)을 Date 객체로 변환
    const parsedDob = dob ? new Date(dob) : null;

    const user = new User(); // User 엔티티 인스턴스 생성
    user.username = username;
    user.password = hashedPassword;
    user.mail = mail;
    user.nickname = nickname;
    user.position = position;
    user.dob = parsedDob;
    user.ig_url = ig_url === undefined ? null : ig_url;
    user.pfp_img_url = pfp_img_url === undefined ? null : pfp_img_url;

    const savedUser = await this.usersRepository.save(user);

    // position이 celeb인 경우 tb_celeb에 추가
    if (position === 'celeb') {
      if (company_id === undefined || celeb_type === undefined) {
        throw new BadRequestException('company_id and celeb_type are required for celeb position');
      }
      await this.celebService.createCeleb({ userId: savedUser.userId, companyId: company_id, celebType: celeb_type });
    }

    return savedUser;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByUserId(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userId } });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 닉네임 중복 확인
    if (updateUserDto.nickname && updateUserDto.nickname !== user.nickname) {
      const existingUser = await this.usersRepository.findOne({ where: { nickname: updateUserDto.nickname } });
      if (existingUser) {
        throw new ConflictException('Nickname already exists');
      }
    }

    // 인스타그램 URL 중복 확인
    if (updateUserDto.ig_url && updateUserDto.ig_url !== user.ig_url) {
      const existingUser = await this.usersRepository.findOne({ where: { ig_url: updateUserDto.ig_url } });
      if (existingUser) {
        throw new ConflictException('Instagram URL already exists');
      }
    }

    // 비밀번호 해싱
    if (updateUserDto.password) {
      try {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      } catch (error) {
        throw new InternalServerErrorException('Failed to hash password');
      }
    }

    // 업데이트할 필드만 적용
    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);

    // position이 celeb인 경우 tb_celeb 업데이트
    if (updatedUser.position === 'celeb') {
      if (updateUserDto.company_id !== undefined || updateUserDto.celeb_type !== undefined) {
        await this.celebService.updateCeleb(updatedUser.userId, {
          companyId: updateUserDto.company_id,
          celebType: updateUserDto.celeb_type,
        });
      }
    }

    return updatedUser;
  }

  async requestPasswordReset(mail: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { mail } });
    if (!user) {
      // 보안상 사용자가 존재하지 않아도 성공으로 응답
      console.log(`Password reset requested for non-existent email: ${mail}`);
      return;
    }

    // TODO: 비밀번호 재설정 토큰 생성 및 이메일 전송 로직 구현
    // 현재는 플레이스홀더
    console.log(`Password reset token would be sent to ${mail}`);
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    // TODO: 토큰 유효성 검사 및 비밀번호 재설정 로직 구현
    // 현재는 플레이스홀더
    console.log(`Password reset confirmed with token: ${token}`);

    // 예시: 토큰이 유효하다고 가정하고 사용자 비밀번호 업데이트
    const user = await this.usersRepository.findOne({ where: { /* 토큰으로 사용자 찾기 */ } }); // 실제 구현에서는 토큰을 통해 사용자를 찾아야 합니다.
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    try {
      user.password = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.save(user);
      console.log(`Password for user ${user.userId} has been reset.`);
    } catch (error) {
      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
