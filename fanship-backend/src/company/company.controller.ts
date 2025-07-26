import { Controller, Get, Query, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CelebService } from '../celeb/celeb.service';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly celebService: CelebService,
  ) {}

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
