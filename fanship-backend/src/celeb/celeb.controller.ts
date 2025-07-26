import { Controller, Get, Param } from '@nestjs/common';
import { CelebService } from './celeb.service';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('celebs')
export class CelebController {
  constructor(
    private readonly celebService: CelebService,
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get(':celebId')
  async findOneById(@Param('celebId') celebId: number): Promise<any> {
    return this.celebService.findOneById(celebId);
  }

  @Get(':celebId/schedules')
  async findSchedulesByCelebId(@Param('celebId') celebId: number): Promise<{ list: any[] }> {
    const schedules = await this.scheduleService.findSchedulesByCelebId(celebId);
    return { list: schedules };
  }
}
