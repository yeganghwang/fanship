import { Controller, Get, Query, Param, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CelebService } from '../celeb/celeb.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly celebService: CelebService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto, @Request() req): Promise<any> {
    const ceoId = req.user.userId;
    return this.companyService.createCompany(ceoId, createCompanyDto);
  }

  @Get()
  async findAll(
    @Query('region') region?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.companyService.findAll(region, page, limit);
  }

  @Get(':companyId/celebs')
  async findCelebsByCompanyId(
    @Param('companyId') companyId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.celebService.findCelebsByCompanyId(companyId, page, limit);
  }
}
