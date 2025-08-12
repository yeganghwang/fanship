import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CelebService } from '../celeb/celeb.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/create-schedule.dto';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private celebService: CelebService,
  ) {}

  async findSchedulesByCelebId(celebId: number, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const celeb = await this.celebService.findOneById(celebId);
    if (!celeb) {
      throw new NotFoundException(`Celeb with ID ${celebId} not found`);
    }

    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.celebId = :celebId', { celebId })
      .orderBy('schedule.start_dt', 'ASC');

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const schedules = await query.getMany();

    const list = schedules.map(schedule => ({
      schedule_id: schedule.id,
      celeb_id: schedule.celebId,
      schedule_type: schedule.schedule_type,
      start_dt: schedule.start_dt,
      end_dt: schedule.end_dt,
    }));

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      list,
      pagination,
    };
  }

  async createSchedule(celebId: number, createScheduleDto: CreateScheduleDto, userId: number): Promise<any> {
    // 권한 확인: 해당 사용자가 셀럽인지 확인
    const userCeleb = await this.celebService.findCelebByUserId(userId);
    if (!userCeleb) {
      throw new ForbiddenException('You are not a celeb');
    }

    // 해당 사용자가 요청한 셀럽의 소유자인지 확인
    if (userCeleb.celebId !== celebId) {
      throw new ForbiddenException('You are not authorized to create schedule for this celeb');
    }

    // 셀럽 존재 여부 확인 (권한 확인 후)
    const celeb = await this.celebService.findOneById(celebId);
    if (!celeb) {
      throw new NotFoundException(`Celeb with ID ${celebId} not found`);
    }

    const newSchedule = new Schedule();
    newSchedule.celebId = celebId;
    newSchedule.schedule_type = createScheduleDto.schedule_type;
    newSchedule.start_dt = new Date(createScheduleDto.start_dt);
    if (createScheduleDto.end_dt) {
      newSchedule.end_dt = new Date(createScheduleDto.end_dt);
    }

    const savedSchedule = await this.scheduleRepository.save(newSchedule);

    return {
      schedule_id: savedSchedule.id,
      celeb_id: savedSchedule.celebId,
      schedule_type: savedSchedule.schedule_type,
      start_dt: savedSchedule.start_dt,
      end_dt: savedSchedule.end_dt,
    };
  }

  async deleteSchedule(scheduleId: number, userId: number, userPosition: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['celeb'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // 셀럽의 사용자 ID와 요청한 사용자 ID가 일치하는지 확인
    if (userPosition !== 'manager' && schedule.celeb.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this schedule');
    }

    await this.scheduleRepository.remove(schedule);
  }
}
