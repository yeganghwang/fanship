import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  schedule_type: string;

  @IsDateString()
  start_dt: string;

  @IsOptional()
  @IsDateString()
  end_dt?: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  schedule_type?: string;

  @IsOptional()
  @IsDateString()
  start_dt?: string;

  @IsOptional()
  @IsDateString()
  end_dt?: string;
} 