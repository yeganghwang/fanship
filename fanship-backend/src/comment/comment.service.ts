import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/create-comment.dto';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';
import { Celeb } from '../celeb/celeb.entity';
import { Company } from '../company/company.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  @InjectRepository(Celeb)
  private celebRepository: Repository<Celeb>,
  @InjectRepository(Company)
  private companyRepository: Repository<Company>,
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

    // 수집: celeb / ceo 사용자 ID 목록
    const celebUserIds: number[] = [];
    const ceoUserIds: number[] = [];
    for (const c of comments) {
      if (c.writer?.position === 'celeb') celebUserIds.push(c.writerId);
      else if (c.writer?.position === 'ceo') ceoUserIds.push(c.writerId);
    }

    // 중복 제거
    const uniq = (arr: number[]) => Array.from(new Set(arr));
    const uniqueCelebUserIds = uniq(celebUserIds);
    const uniqueCeoUserIds = uniq(ceoUserIds);

    // 관련 ID 매핑 조회 (bulk)
    const celebMap = new Map<number, number>(); // userId -> celebId
    if (uniqueCelebUserIds.length) {
      const celebs = await this.celebRepository.find({ where: { userId: In(uniqueCelebUserIds) } });
      for (const celeb of celebs) celebMap.set(celeb.userId, celeb.celebId);
    }

    const companyMap = new Map<number, number>(); // userId -> companyId
    if (uniqueCeoUserIds.length) {
      const companies = await this.companyRepository.find({ where: { ceoId: In(uniqueCeoUserIds) } });
      for (const company of companies) companyMap.set(company.ceoId, company.id);
    }

    const list = comments.map(comment => {
      const writerPosition = comment.writer?.position;
      const base: any = {
        comment_id: comment.id,
        post_id: comment.postId,
        writer_id: comment.writerId,
        writer_position: writerPosition,
        nickname: comment.writer?.nickname,
        pfp_img_url: comment.writer?.pfp_img_url,
        content: comment.content,
        created_at: comment.createdAt.toISOString(),
      };
      if (writerPosition === 'celeb') {
        const celebId = celebMap.get(comment.writerId);
        if (celebId) base.celeb_id = celebId;
      } else if (writerPosition === 'ceo') {
        const companyId = companyMap.get(comment.writerId);
        if (companyId) base.company_id = companyId;
      }
      return base;
    });

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
