import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CelebService } from '../celeb/celeb.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private celebService: CelebService,
  ) {}

  async findSchedulesByCelebId(celebId: number): Promise<Schedule[]> {
    const celeb = await this.celebService.findOneById(celebId);
    if (!celeb) {
      throw new NotFoundException(`Celeb with ID ${celebId} not found`);
    }

    return this.scheduleRepository.find({
      where: { celebId },
      order: { start_dt: 'ASC' },
    });
  }
}
