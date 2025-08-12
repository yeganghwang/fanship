import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postService: PostService,
    private userService: UserService,
  ) {}

  async createComment(postId: number, writerId: number, createCommentDto: CreateCommentDto): Promise<any> {
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
    const savedComment = await this.commentRepository.save(newComment);

    // api.md 명세에 맞는 응답 형식으로 변환
    return {
      comment_id: savedComment.id,
      post_id: savedComment.postId,
      writer_id: savedComment.writerId,
      nickname: writer.nickname,
      content: savedComment.content,
      created_at: savedComment.createdAt,
    };
  }

  async findCommentsByPostId(postId: number, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const post = await this.postService.findOneById(postId, false);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'user')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.visible = :visible', { visible: true })
      .orderBy('comment.createdAt', 'ASC');

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const comments = await query.getMany();

    const list = comments.map(comment => ({
      comment_id: comment.id,
      post_id: comment.postId,
      writer_id: comment.writerId,
      nickname: comment.writer.nickname,
      content: comment.content,
      created_at: comment.createdAt.toISOString(),
    }));

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      list,
      pagination,
    };
  }

  async updateComment(commentId: number, userId: number, userPosition: string, updateCommentDto: UpdateCommentDto): Promise<any> {
    const comment = await this.commentRepository.findOne({ 
      where: { id: commentId, visible: true },
      relations: ['writer']
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (userPosition !== 'manager' && comment.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this comment');
    }

    comment.content = updateCommentDto.content;
    const updatedComment = await this.commentRepository.save(comment);

    // api.md 명세에 맞는 응답 형식으로 변환
    return {
      comment_id: updatedComment.id,
      post_id: updatedComment.postId,
      writer_id: updatedComment.writerId,
      nickname: updatedComment.writer.nickname,
      content: updatedComment.content,
      created_at: updatedComment.createdAt,
    };
  }

  async deleteComment(commentId: number, userId: number, userPosition: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, visible: true } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (userPosition !== 'manager' && comment.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    comment.visible = false;
    await this.commentRepository.save(comment);
  }
}
