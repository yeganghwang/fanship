import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Param, Delete, ForbiddenException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schedule.entity';
import { AuthGuard } from '@nestjs/passport';

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
    return this.scheduleService.createSchedule(Number(celebId), createScheduleDto, req.user.userId);
  }

  @Get(':celebId/schedules')
  async findSchedulesByCelebId(@Param('celebId') celebId: number): Promise<{ list: any[] }> {
    const schedules = await this.scheduleService.findSchedulesByCelebId(celebId);
    return { list: schedules };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('schedules/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(@Param('scheduleId') scheduleId: number, @Request() req): Promise<void> {
    await this.scheduleService.deleteSchedule(scheduleId, req.user.userId);
  }
} 