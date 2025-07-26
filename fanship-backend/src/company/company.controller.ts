import { Controller, Get, Query, Param, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CelebService } from '../celeb/celeb.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly celebService: CelebService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto, @Request() req): Promise<Company> {
    const ceoId = req.user.userId;
    return this.companyService.createCompany(ceoId, createCompanyDto);
  }

  @Get()
  async findAll(@Query('region') region?: string): Promise<{ list: Company[] }> {
    const companies = await this.companyService.findAll(region);
    return { list: companies };
  }

  @Get(':companyId/celebs')
  async findCelebsByCompanyId(@Param('companyId') companyId: number): Promise<{ list: any[] }> {
    const celebs = await this.celebService.findCelebsByCompanyId(companyId);
    return { list: celebs };
  }
}
