import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Query, Param, Delete, Patch } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { UpdateGoodsDto } from './dto/update-goods.dto';
import { Goods } from './goods.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGoods(@Body() createGoodsDto: CreateGoodsDto, @Request() req): Promise<any> {
    const sellerId = req.user.userId;
    return this.goodsService.createGoods(sellerId, createGoodsDto);
  }

  @Get()
  async findAll(
    @Query('seller_id') sellerId?: number,
    @Query('seller_nickname') sellerNickname?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.goodsService.findAll(sellerId, sellerNickname, page, limit);
  }

  @Get(':goodsId')
  async findOneById(@Param('goodsId') goodsId: number): Promise<any> {
    return this.goodsService.findOneById(goodsId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':goodsId')
  async updateGoods(
    @Param('goodsId') goodsId: number,
    @Body() updateGoodsDto: UpdateGoodsDto,
    @Request() req,
  ): Promise<any> {
    return this.goodsService.updateGoods(goodsId, req.user.userId, updateGoodsDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':goodsId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGoods(@Param('goodsId') goodsId: number, @Request() req): Promise<void> {
    await this.goodsService.deleteGoods(goodsId, req.user.userId);
  }
}
