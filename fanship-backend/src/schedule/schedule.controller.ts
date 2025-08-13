import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param, Delete, ForbiddenException, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schedule.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Controller('celebs')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':celebId/schedules')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(
    @Param('celebId') celebId: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req,
  ): Promise<any> {
    return this.scheduleService.createSchedule(Number(celebId), createScheduleDto, req.user.userId, req.user.position);
  }

  @Get(':celebId/schedules')
  async findSchedulesByCelebId(
    @Param('celebId') celebId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.scheduleService.findSchedulesByCelebId(celebId, page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('schedules/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(@Param('scheduleId') scheduleId: number, @Request() req): Promise<void> {
    await this.scheduleService.deleteSchedule(scheduleId, req.user.userId, req.user.position);
  }
} 