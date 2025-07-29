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



    // 빈 문자열을 null로 변환
    const processedUpdateData = { ...updateUserDto };
    if (processedUpdateData.pfp_img_url === '') {
      processedUpdateData.pfp_img_url = null;
    }
    if (processedUpdateData.ig_url === '') {
      processedUpdateData.ig_url = null;
    }

    // 업데이트할 필드만 적용
    Object.assign(user, processedUpdateData);

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


}
