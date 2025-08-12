import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goods } from './goods.entity';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { UpdateGoodsDto } from './dto/update-goods.dto';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Celeb } from '../celeb/celeb.entity';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  async createGoods(sellerId: number, createGoodsDto: CreateGoodsDto): Promise<any> {
    const newGoods = this.goodsRepository.create({
      ...createGoodsDto,
      sellerId,
    });
    const savedGoods = await this.goodsRepository.save(newGoods);

    return {
      goods_id: savedGoods.id,
      seller_id: savedGoods.sellerId,
      title: savedGoods.title,
      content: savedGoods.content,
      price: savedGoods.price,
      amount: savedGoods.amount,
      created_at: savedGoods.createdAt,
      views: savedGoods.views,
      sold: savedGoods.sold,
    };
  }

  async findAll(sellerId?: number, sellerNickname?: string, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const query = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .where('goods.visible = :visible', { visible: true });

    if (sellerId !== undefined) {
      query.andWhere('goods.sellerId = :sellerId', { sellerId });
    }

    if (sellerNickname !== undefined) {
      query.andWhere('user.nickname LIKE :sellerNickname', { sellerNickname: `%${sellerNickname}%` });
    }

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const goods = await query.getMany();

    const list = goods.map(item => ({
      goods_id: item.id,
      seller_nickname: item.seller.nickname,
      seller_id: item.seller.userId,
      title: item.title,
      price: Number(item.price),
      amount: item.amount,
      notice: item.visible,
    }));

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      list,
      pagination,
    };
  }

  async findGoodsByUserId(userId: number, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const query = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .where('goods.sellerId = :userId', { userId })
      .andWhere('goods.visible = :visible', { visible: true });

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const goods = await query.getMany();

    const list = goods.map(item => ({
      goods_id: item.id,
      seller_id: item.sellerId,
      title: item.title,
      content: item.content,
      price: Number(item.price),
      amount: item.amount,
      visible: item.visible,
      sold: item.sold,
      views: item.views,
      notice: item.visible,
    }));

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      list,
      pagination,
    };
  }

  async findOneById(goodsId: number): Promise<any> {
    const goods = await this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .leftJoinAndSelect('user.celeb', 'celeb')
      .leftJoinAndSelect('celeb.company', 'company')
      .where('goods.id = :goodsId', { goodsId })
      .andWhere('goods.visible = :visible', { visible: true })
      .select([
        'goods.id',
        'goods.title',
        'goods.content',
        'goods.price',
        'goods.amount',
        'goods.visible',
        'goods.views',
        'goods.sold',
        'user.nickname',
        'user.userId',
        'celeb.celeb_type',
        'company.company_name',
      ])
      .getOne();

    if (!goods) {
      throw new NotFoundException(`Goods with ID ${goodsId} not found or not visible`);
    }

    goods.views += 1;
    await this.goodsRepository.save(goods);

    return {
      company_name: goods.seller.celeb?.company?.company_name || null,
      celeb_type: goods.seller.celeb?.celeb_type || null,
      seller_nickname: goods.seller.nickname,
      seller_id: goods.seller.userId,
      title: goods.title,
      content: goods.content,
      price: Number(goods.price),
      amount: goods.amount,
      notice: goods.visible,
    };
  }

  async deleteGoods(goodsId: number, userId: number, userPosition: string): Promise<void> {
    const goods = await this.goodsRepository.findOne({ where: { id: goodsId } });

    if (!goods) {
      throw new NotFoundException(`Goods with ID ${goodsId} not found`);
    }

    if (userPosition !== 'manager' && goods.sellerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this goods');
    }

    goods.visible = false;
    await this.goodsRepository.save(goods);
  }

  async updateGoods(goodsId: number, userId: number, userPosition: string, updateGoodsDto: UpdateGoodsDto): Promise<any> {
    const goods = await this.goodsRepository.findOne({ where: { id: goodsId, visible: true } });

    if (!goods) {
      throw new NotFoundException(`Goods with ID ${goodsId} not found or not visible`);
    }

    if (userPosition !== 'manager' && goods.sellerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this goods');
    }

    Object.assign(goods, updateGoodsDto);
    const updatedGoods = await this.goodsRepository.save(goods);

    return {
      goods_id: updatedGoods.id,
      seller_id: updatedGoods.sellerId,
      title: updatedGoods.title,
      content: updatedGoods.content,
      price: Number(updatedGoods.price),
      amount: updatedGoods.amount,
      created_at: updatedGoods.createdAt,
      views: updatedGoods.views,
      sold: updatedGoods.sold,
    };
  }
}
