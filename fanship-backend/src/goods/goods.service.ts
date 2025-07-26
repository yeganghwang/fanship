import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goods } from './goods.entity';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { UpdateGoodsDto } from './dto/update-goods.dto';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Celeb } from '../celeb/celeb.entity';

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
      createdt: savedGoods.createdAt,
      visible: savedGoods.visible,
      views: savedGoods.views,
      sold: savedGoods.sold,
    };
  }

  async findAll(sellerId?: number): Promise<any[]> {
    const query = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .where('goods.visible = :visible', { visible: true });

    if (sellerId !== undefined) {
      query.andWhere('goods.sellerId = :sellerId', { sellerId });
    }

    const goods = await query.getMany();

    return goods.map(item => ({
      goods_id: item.id,
      title: item.title,
      price: Number(item.price),
      amount: item.amount,
      notice: item.visible,
    }));
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
      title: goods.title,
      content: goods.content,
      price: Number(goods.price),
      amount: goods.amount,
      notice: goods.visible,
    };
  }

  async deleteGoods(goodsId: number, userId: number): Promise<void> {
    const goods = await this.goodsRepository.findOne({ where: { id: goodsId } });

    if (!goods) {
      throw new NotFoundException(`Goods with ID ${goodsId} not found`);
    }

    if (goods.sellerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this goods');
    }

    goods.visible = false;
    await this.goodsRepository.save(goods);
  }

  async updateGoods(goodsId: number, userId: number, updateGoodsDto: UpdateGoodsDto): Promise<any> {
    const goods = await this.goodsRepository.findOne({ where: { id: goodsId, visible: true } });

    if (!goods) {
      throw new NotFoundException(`Goods with ID ${goodsId} not found or not visible`);
    }

    if (goods.sellerId !== userId) {
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
      visible: updatedGoods.visible,
      views: updatedGoods.views,
      sold: updatedGoods.sold,
    };
  }

  async findGoodsByUserId(userId: number): Promise<any[]> {
    const goods = await this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .where('goods.sellerId = :userId', { userId })
      .andWhere('goods.visible = :visible', { visible: true })
      .select([
        'goods.id',
        'goods.sellerId',
        'goods.title',
        'goods.content',
        'goods.price',
        'goods.amount',
        'goods.visible',
        'goods.sold',
        'goods.views',
      ])
      .orderBy('goods.createdAt', 'DESC')
      .getMany();

    console.log('Fetched goods:', goods);

    return goods.map(item => ({
      goods_id: item.id,
      seller_id: item.sellerId,
      title: item.title,
      content: item.content,
      price: Number(item.price),
      amount: item.amount,
      visible: item.visible,
      sold: item.sold,
      views: item.views,
    }));
  }
}
