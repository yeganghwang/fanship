import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const writer = await this.userService.findOneByUserId(createPostDto.writerId);
    if (!writer) {
      throw new NotFoundException(`Writer with ID ${createPostDto.writerId} not found`);
    }

    const newPost = this.postRepository.create(createPostDto);
    return this.postRepository.save(newPost);
  }

  async findAll(notice?: boolean): Promise<any[]> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .select([
        'post.id',
        'post.writerId',
        'user.nickname',
        'post.title',
        'post.createdAt',
        'post.views',
        'post.notice',
      ])
      .where('post.visible = :visible', { visible: true });

    if (notice !== undefined) {
      query.andWhere('post.notice = :notice', { notice });
    }

    query.orderBy('post.createdAt', 'DESC');

    return query.getMany();
  }

  async findOneById(postId: number): Promise<any> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where('post.id = :postId', { postId })
      .andWhere('post.visible = :visible', { visible: true })
      .select([
        'post.id',
        'post.writerId',
        'user.nickname',
        'post.title',
        'post.content',
        'post.createdAt',
        'post.views',
        'post.notice',
      ])
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found or not visible`);
    }

    post.views += 1;
    await this.postRepository.save(post);

    return {
      post_id: post.id,
      writer_id: post.writerId,
      nickname: post.writer.nickname,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
      views: post.views,
      notice: post.notice,
    };
  }

  async deletePost(postId: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (post.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this post');
    }

    post.visible = false;
    await this.postRepository.save(post);
  }

  async findPostsByUserId(userId: number): Promise<any[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'user')
      .where('post.writerId = :userId', { userId })
      .andWhere('post.visible = :visible', { visible: true })
      .select([
        'post.id',
        'post.writerId',
        'user.nickname',
        'post.title',
        'post.createdAt',
        'post.views',
        'post.notice',
      ])
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map(post => ({
      post_id: post.id,
      writer_id: post.writerId,
      nickname: post.writer.nickname,
      title: post.title,
      created_at: post.createdAt,
      views: post.views,
      notice: post.notice,
    }));
  }

  async updatePost(postId: number, userId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId, visible: true } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found or not visible`);
    }

    if (post.writerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this post');
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }
}

