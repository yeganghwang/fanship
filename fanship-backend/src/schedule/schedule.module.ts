import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './schedule.entity';
import { CelebModule } from '../celeb/celeb.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    forwardRef(() => CelebModule),
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
