import { Injectable, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async addFavorite(createFavoriteDto: CreateFavoriteDto, userId: number): Promise<any> {
    const { company_id, celeb_id } = createFavoriteDto;

    if (!company_id && !celeb_id) {
      throw new BadRequestException('Either company_id or celeb_id must be provided.');
    }
    if (company_id && celeb_id) {
      throw new BadRequestException('Cannot add both company and celeb as favorite at the same time.');
    }

    // userId 존재 여부 확인
    const user = await this.userService.findOneByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // company_id 존재 여부 확인
    if (company_id) {
      const company = await this.companyService.findOneById(company_id);
      if (!company) {
        throw new NotFoundException(`Company with ID ${company_id} not found`);
      }
    }

    // celeb_id 존재 여부 확인
    if (celeb_id) {
      const celeb = await this.celebService.findOneById(celeb_id);
      if (!celeb) {
        throw new NotFoundException(`Celeb with ID ${celeb_id} not found`);
      }
    }

    // 중복 즐겨찾기 확인
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, companyId: company_id, celebId: celeb_id },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorite already exists.');
    }

    const newFavorite = this.favoriteRepository.create({
      userId,
      companyId: company_id,
      celebId: celeb_id,
    });
    const savedFavorite = await this.favoriteRepository.save(newFavorite);

    // api.md 명세에 맞는 응답 형식으로 변환
    return {
      favorite_id: savedFavorite.id,
    };
  }

  async findFavoritesByUserId(userId: number): Promise<any[]> {
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.company', 'company')
      .leftJoinAndSelect('favorite.celeb', 'celeb')
      .leftJoinAndSelect('celeb.user', 'celebUser')
      .where('favorite.userId = :userId', { userId })
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

  async deleteFavorite(favoriteId: number, userId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({ where: { id: favoriteId } });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${favoriteId} not found`);
    }

    if (favorite.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this favorite');
    }

    await this.favoriteRepository.remove(favorite);
  }
}
