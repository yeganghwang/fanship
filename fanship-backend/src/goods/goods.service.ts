import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goods } from './goods.entity';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Celeb } from '../celeb/celeb.entity';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  async createGoods(sellerId: number, createGoodsDto: CreateGoodsDto): Promise<Goods> {
    const newGoods = this.goodsRepository.create({
      ...createGoodsDto,
      sellerId,
    });
    return this.goodsRepository.save(newGoods);
  }

  async findAll(sellerId?: number): Promise<any[]> {
    const query = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.seller', 'user')
      .select([
        'goods.title',
        'goods.price',
        'goods.amount',
        'goods.visible',
        'goods.sold',
      ])
      .where('goods.visible = :visible', { visible: true });

    if (sellerId !== undefined) {
      query.andWhere('goods.sellerId = :sellerId', { sellerId });
    }

    return query.getMany();
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
      price: goods.price,
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
}
