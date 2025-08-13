import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Celeb } from '../celeb/celeb.entity';
import { Company } from '../company/company.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Comment, Celeb, Company]),
    PostModule,
    UserModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
