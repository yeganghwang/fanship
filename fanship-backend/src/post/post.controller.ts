import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Query, Param, Delete, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './post.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req): Promise<PostEntity> {
    createPostDto.writerId = createPostDto.writerId || req.user.userId;
    return this.postService.createPost(createPostDto);
  }

  @Get()
  async findAll(@Query('notice') notice?: string): Promise<{ list: any[] }> {
    let noticeFilter: boolean | undefined;
    if (notice !== undefined) {
      noticeFilter = notice === 'true';
    }
    const posts = await this.postService.findAll(noticeFilter);
    return { list: posts };
  }

  @Get(':postId')
  async findOneById(@Param('postId') postId: number): Promise<any> {
    return this.postService.findOneById(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    return this.postService.updatePost(postId, req.user.userId, updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId') postId: number, @Request() req): Promise<void> {
    await this.postService.deletePost(postId, req.user.userId);
  }
}
