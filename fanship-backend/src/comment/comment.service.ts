import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postService: PostService,
    private userService: UserService,
  ) {}

  async createComment(postId: number, writerId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content } = createCommentDto;

    const post = await this.postService.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const writer = await this.userService.findOneByUserId(writerId);
    if (!writer) {
      throw new NotFoundException(`User with ID ${writerId} not found`);
    }

    const newComment = this.commentRepository.create({ postId, writerId, content });
    return this.commentRepository.save(newComment);
  }

  async findCommentsByPostId(postId: number): Promise<any[]> {
    const post = await this.postService.findOneById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    
    const comments = await this.commentRepository.find({
      where: { postId, visible: true },
      relations: ['writer'],
      order: { createdAt: 'ASC' },
    });

    return comments.map(comment => ({
      comment_id: comment.id,
      post_id: comment.postId,
      writer_id: comment.writerId,
      nickname: comment.writer.nickname,
      content: comment.content,
      created_at: comment.createdAt.toISOString().split('T')[0], // YYYY-MM-DD 형식
    }));
  }

  async updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, visible: true } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this comment');
    }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, visible: true } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    comment.visible = false;
    await this.commentRepository.save(comment);
  }
}
