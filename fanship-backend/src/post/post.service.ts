import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/user.entity';
import { Celeb } from '../celeb/celeb.entity';
import { Company } from '../company/company.entity';
import { UserService } from '../user/user.service';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  @InjectRepository(Celeb)
  private celebRepository: Repository<Celeb>,
  @InjectRepository(Company)
  private companyRepository: Repository<Company>,
    private userService: UserService,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<any> {
    const writer = await this.userService.findOneByUserId(createPostDto.writerId);
    if (!writer) {
      throw new NotFoundException(`Writer with ID ${createPostDto.writerId} not found`);
    }

    const newPost = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(newPost);

    // api.md 명세에 맞는 응답 형식으로 변환
    const base: any = {
        post_id: savedPost.id,
        writer_id: savedPost.writerId,
        nickname: writer.nickname,
        title: savedPost.title,
        content: savedPost.content,
        created_at: savedPost.createdAt,
        views: savedPost.views,
        notice: savedPost.notice,
    };
    if (writer.position === 'celeb') {
      const celeb = await this.celebRepository.findOne({ where: { userId: writer.userId } });
      if (celeb) base.celeb_id = celeb.celebId;
    } else if (writer.position === 'ceo') {
      const company = await this.companyRepository.findOne({ where: { ceoId: writer.userId } });
      if (company) base.company_id = company.id;
    }
    return base;
  }

  async findAll(notice?: boolean, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where('post.visible = :visible', { visible: true });

    if (notice !== undefined) {
      query.andWhere('post.notice = :notice', { notice });
    }

    query.orderBy('post.createdAt', 'DESC');

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const posts = await query.getMany();

    // Collect writer positions
    const celebUserIds: number[] = [];
    const ceoUserIds: number[] = [];
    for (const p of posts) {
      if (p.writer?.position === 'celeb') celebUserIds.push(p.writerId);
      else if (p.writer?.position === 'ceo') ceoUserIds.push(p.writerId);
    }
    const uniq = (arr: number[]) => Array.from(new Set(arr));
    const celebMap = new Map<number, number>();
    if (celebUserIds.length) {
      const celebs = await this.celebRepository.find({ where: { userId: In(uniq(celebUserIds)) } });
      for (const c of celebs) celebMap.set(c.userId, c.celebId);
    }
    const companyMap = new Map<number, number>();
    if (ceoUserIds.length) {
      const companies = await this.companyRepository.find({ where: { ceoId: In(uniq(ceoUserIds)) } });
      for (const comp of companies) companyMap.set(comp.ceoId, comp.id);
    }

    const list = posts.map(post => {
      const base: any = {
        post_id: post.id,
        writer_id: post.writerId,
        nickname: post.writer.nickname,
        title: post.title,
        created_at: post.createdAt.toISOString(),
        views: post.views,
        notice: post.notice,
      };
      if (post.writer?.position === 'celeb') {
        const celebId = celebMap.get(post.writerId);
        if (celebId) base.celeb_id = celebId;
      } else if (post.writer?.position === 'ceo') {
        const companyId = companyMap.get(post.writerId);
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

  async findPostsByUserId(userId: number, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where('post.writerId = :userId', { userId })
      .andWhere('post.visible = :visible', { visible: true })
      .orderBy('post.createdAt', 'DESC');

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const posts = await query.getMany();

    const celebUserIds: number[] = [];
    const ceoUserIds: number[] = [];
    for (const p of posts) {
      if (p.writer?.position === 'celeb') celebUserIds.push(p.writerId);
      else if (p.writer?.position === 'ceo') ceoUserIds.push(p.writerId);
    }
    const uniq = (arr: number[]) => Array.from(new Set(arr));
    const celebMap = new Map<number, number>();
    if (celebUserIds.length) {
      const celebs = await this.celebRepository.find({ where: { userId: In(uniq(celebUserIds)) } });
      for (const c of celebs) celebMap.set(c.userId, c.celebId);
    }
    const companyMap = new Map<number, number>();
    if (ceoUserIds.length) {
      const companies = await this.companyRepository.find({ where: { ceoId: In(uniq(ceoUserIds)) } });
      for (const comp of companies) companyMap.set(comp.ceoId, comp.id);
    }
    const list = posts.map(post => {
      const base: any = {
        post_id: post.id,
        writer_id: post.writerId,
        nickname: post.writer.nickname,
        title: post.title,
        created_at: post.createdAt.toISOString(),
        views: post.views,
        notice: post.notice,
      };
      if (post.writer?.position === 'celeb') {
        const celebId = celebMap.get(post.writerId);
        if (celebId) base.celeb_id = celebId;
      } else if (post.writer?.position === 'ceo') {
        const companyId = companyMap.get(post.writerId);
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

  async findOneById(postId: number, increaseView = true): Promise<any> {
    if (increaseView) {
      await this.postRepository.increment({ id: postId }, 'views', 1);
    }

    // 전체 필드 조회
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where('post.id = :postId', { postId })
      .andWhere('post.visible = :visible', { visible: true })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found or not visible`);
    }

    const base: any = {
        post_id: post.id,
        writer_id: post.writerId,
        nickname: post.writer.nickname,
        pfp_img_url: post.writer.pfp_img_url,
        title: post.title,
        content: post.content,
        created_at: post.createdAt,
        views: post.views,
        notice: post.notice,
    };
    if (post.writer?.position === 'celeb') {
      const celeb = await this.celebRepository.findOne({ where: { userId: post.writerId } });
      if (celeb) base.celeb_id = celeb.celebId;
    } else if (post.writer?.position === 'ceo') {
      const company = await this.companyRepository.findOne({ where: { ceoId: post.writerId } });
      if (company) base.company_id = company.id;
    }
    return base;
  }

  async deletePost(postId: number, userId: number, userPosition: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (userPosition !== 'manager' && post.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this post');
    }

    post.visible = false;
    await this.postRepository.save(post);
  }

  async updatePost(postId: number, userId: number, userPosition: string, updatePostDto: UpdatePostDto): Promise<any> {
    const post = await this.postRepository.findOne({ 
      where: { id: postId, visible: true },
      relations: ['writer']
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found or not visible`);
    }

    if (userPosition !== 'manager' && post.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this post');
    }

    Object.assign(post, updatePostDto);
    const updatedPost = await this.postRepository.save(post);

    const base: any = {
        post_id: updatedPost.id,
        writer_id: updatedPost.writerId,
        nickname: updatedPost.writer.nickname,
        title: updatedPost.title,
        content: updatedPost.content,
        created_at: updatedPost.createdAt,
        views: updatedPost.views,
        notice: updatedPost.notice,
    };
    if (updatedPost.writer?.position === 'celeb') {
      const celeb = await this.celebRepository.findOne({ where: { userId: updatedPost.writerId } });
      if (celeb) base.celeb_id = celeb.celebId;
    } else if (updatedPost.writer?.position === 'ceo') {
      const company = await this.companyRepository.findOne({ where: { ceoId: updatedPost.writerId } });
      if (company) base.company_id = company.id;
    }
    return base;
  }
}

