import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './favorite.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req): Promise<Favorite> {
    return this.favoriteService.addFavorite(createFavoriteDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':favoriteId')
  @HttpCode(HttpStatus.OK)
  async deleteFavorite(@Param('favoriteId') favoriteId: number, @Request() req): Promise<{ message: string }> {
    await this.favoriteService.deleteFavorite(favoriteId, req.user.userId);
    return { message: '즐겨찾기가 성공적으로 삭제되었습니다.' };
  }
}
