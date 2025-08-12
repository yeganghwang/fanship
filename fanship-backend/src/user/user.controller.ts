import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, UseGuards, Request, NotFoundException, ForbiddenException, Patch, Delete, Query  } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordResetRequestDto, PasswordResetConfirmDto } from './dto/password-reset.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from '../favorite/favorite.service';
import { PostService } from '../post/post.service';
import { GoodsService } from '../goods/goods.service';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Controller('users') // 기본 경로 설정
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly favoriteService: FavoriteService,
    private readonly postService: PostService,
    private readonly goodsService: GoodsService,
  ) {}

  

  @Get(':userId') // api.md 명세에 따라 {user_id} 경로 사용 (인증 불필요)
  async getUserProfile(@Param('userId') userId: number): Promise<any> {
    const requestedUserId = Number(userId);

    const user = await this.userService.findOneByUserId(requestedUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // api.md 명세에 맞는 응답 형식으로 변환
    return {
      nickname: user.nickname,
      position: user.position,
      pfp_img_url: user.pfp_img_url,
      ig_url: user.ig_url,
      dob: user.dob
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<User> {
    const requestedUserId = Number(userId);
    if (req.user.userId !== requestedUserId) {
      throw new ForbiddenException('You are not authorized to update this profile.');
    }
    return this.userService.updateUser(requestedUserId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content 응답
  async deleteUser(@Param('userId') userId: number, @Request() req): Promise<void> {
    // TODO: 사용자 삭제 로직 구현 (현재는 틀만 만듭니다)
    // 실제 구현 시, 요청한 사용자가 본인인지 또는 관리자 권한이 있는지 확인하는 로직이 필요합니다.
    console.log(`User deletion requested for userId: ${userId}`);
    // throw new NotImplementedException('User deletion is not yet implemented.');
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':userId/favorites')
  async getUserFavorites(
    @Param('userId') userId: number, 
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    const requestedUserId = Number(userId);
    if (req.user.userId !== requestedUserId) {
      throw new ForbiddenException('You are not authorized to view this user\'s favorites.');
    }
    return this.favoriteService.findFavoritesByUserId(requestedUserId, page, limit);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get(':userId/posts')
  async getUserPosts(
    @Param('userId') userId: number, 
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    const requestedUserId = Number(userId);
    // if (req.user.userId !== requestedUserId) {
    //   throw new ForbiddenException('You are not authorized to view this user\'s posts.');
    // }
    return this.postService.findPostsByUserId(requestedUserId, page, limit);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get(':userId/goods')
  async getUserGoods(
    @Param('userId') userId: number, 
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    const requestedUserId = Number(userId);
    //     if (req.user.userId !== requestedUserId) {
    //       throw new ForbiddenException('You are not authorized to view this user\'s goods.');
    //     }
    return this.goodsService.findGoodsByUserId(requestedUserId, page, limit);
  }
}
