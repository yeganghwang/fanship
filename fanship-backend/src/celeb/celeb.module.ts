import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CelebService } from './celeb.service';
import { Celeb } from './celeb.entity';
import { CelebController } from './celeb.controller';
import { ScheduleModule } from '../schedule/schedule.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Celeb]),
    ScheduleModule,
    forwardRef(() => CompanyModule),
  ],
  providers: [CelebService],
  exports: [CelebService],
  controllers: [CelebController],
})
export class CelebModule {}
