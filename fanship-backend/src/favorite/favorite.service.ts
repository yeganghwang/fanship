import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { CelebService } from '../celeb/celeb.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private userService: UserService,
    private companyService: CompanyService,
    private celebService: CelebService,
  ) {}

  async addFavorite(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const { userId, companyId, celebId } = createFavoriteDto;

    if (!companyId && !celebId) {
      throw new BadRequestException('Either companyId or celebId must be provided.');
    }
    if (companyId && celebId) {
      throw new BadRequestException('Cannot add both company and celeb as favorite at the same time.');
    }

    // userId 존재 여부 확인
    const user = await this.userService.findOneByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // companyId 존재 여부 확인
    if (companyId) {
      const company = await this.companyService.findOneById(companyId);
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }
    }

    // celebId 존재 여부 확인
    if (celebId) {
      const celeb = await this.celebService.findOneById(celebId);
      if (!celeb) {
        throw new NotFoundException(`Celeb with ID ${celebId} not found`);
      }
    }

    // 중복 즐겨찾기 확인
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, companyId, celebId },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorite already exists.');
    }

    const newFavorite = this.favoriteRepository.create(createFavoriteDto);
    return this.favoriteRepository.save(newFavorite);
  }

  async findFavoritesByUserId(userId: number): Promise<any[]> {
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.company', 'company')
      .leftJoinAndSelect('favorite.celeb', 'celeb')
      .leftJoinAndSelect('celeb.user', 'celebUser')
      .where('favorite.userId = :userId', { userId })
      .select([
        'favorite.id',
        'favorite.userId',
        'favorite.companyId',
        'favorite.celebId',
        'company.company_name',
        'celebUser.nickname',
      ])
      .getMany();

    return favorites.map(fav => ({
      favorite_id: fav.id,
      user_id: fav.userId,
      company_id: fav.companyId,
      celeb_id: fav.celebId,
      company_name: fav.company?.company_name || null,
      celeb_nickname: fav.celeb?.user?.nickname || null,
    }));
  }
}
