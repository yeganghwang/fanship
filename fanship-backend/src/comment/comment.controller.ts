import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('posts/:postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ): Promise<any> {
    return this.commentService.createComment(Number(postId), Number(req.user.userId), createCommentDto);
  }

  @Get('posts/:postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.commentService.findCommentsByPostId(postId, page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('comments/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ): Promise<any> {
    return this.commentService.updateComment(commentId, req.user.userId, req.user.position, updateCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('commentId') commentId: number, @Request() req): Promise<void> {
    await this.commentService.deleteComment(commentId, req.user.userId, req.user.position);
  }
}
