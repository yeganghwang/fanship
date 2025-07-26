import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Query, Param, Delete } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { Goods } from './goods.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGoods(@Body() createGoodsDto: CreateGoodsDto, @Request() req): Promise<Goods> {
    const sellerId = req.user.userId;
    return this.goodsService.createGoods(sellerId, createGoodsDto);
  }

  @Get()
  async findAll(@Query('seller_id') sellerId?: number): Promise<{ list: any[] }> {
    const goods = await this.goodsService.findAll(sellerId);
    return { list: goods };
  }

  @Get(':goodsId')
  async findOneById(@Param('goodsId') goodsId: number): Promise<any> {
    return this.goodsService.findOneById(goodsId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':goodsId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGoods(@Param('goodsId') goodsId: number, @Request() req): Promise<void> {
    await this.goodsService.deleteGoods(goodsId, req.user.userId);
  }
}
