import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findAll(region?: string): Promise<Company[]> {
    const query = this.companyRepository.createQueryBuilder('company');

    if (region) {
      query.where('company.region = :region', { region });
    }

    return query.getMany();
  }

  async findOneById(companyId: number): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { id: companyId } });
  }
}
