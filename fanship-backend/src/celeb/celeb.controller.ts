import { Controller, Get, Param, Query } from '@nestjs/common';
import { CelebService } from './celeb.service';
import { ScheduleService } from '../schedule/schedule.service';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

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
  async findSchedulesByCelebId(
    @Param('celebId') celebId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.scheduleService.findSchedulesByCelebId(celebId, page, limit);
  }
}
