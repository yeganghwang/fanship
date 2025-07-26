import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';

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
  ): Promise<Comment> {
    return this.commentService.createComment(Number(postId), Number(req.user.userId), createCommentDto);
  }

  @Get('posts/:postId/comments')
  async getCommentsByPostId(@Param('postId') postId: number): Promise<{ list: Comment[] }> {
    const comments = await this.commentService.findCommentsByPostId(postId);
    return { list: comments };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('comments/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    return this.commentService.updateComment(commentId, req.user.userId, updateCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('commentId') commentId: number, @Request() req): Promise<void> {
    await this.commentService.deleteComment(commentId, req.user.userId);
  }
}
