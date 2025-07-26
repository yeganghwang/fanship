import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.entity';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { CelebModule } from '../celeb/celeb.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    forwardRef(() => UserModule),
    CompanyModule,
    CelebModule,
  ],
  providers: [FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
