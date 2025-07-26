import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { Goods } from './goods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goods])],
  providers: [GoodsService],
  controllers: [GoodsController],
})
export class GoodsModule {}
