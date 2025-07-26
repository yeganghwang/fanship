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
    createFavoriteDto.userId = req.user.userId;
    return this.favoriteService.addFavorite(createFavoriteDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':favoriteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFavorite(@Param('favoriteId') favoriteId: number, @Request() req): Promise<void> {
    await this.favoriteService.deleteFavorite(favoriteId, req.user.userId);
  }
}
