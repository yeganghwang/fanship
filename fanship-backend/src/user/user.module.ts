import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FavoriteModule } from '../favorite/favorite.module';
import { PostModule } from '../post/post.module';
import { CelebModule } from '../celeb/celeb.module';
import { GoodsModule } from '../goods/goods.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => FavoriteModule), PostModule, CelebModule, GoodsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
