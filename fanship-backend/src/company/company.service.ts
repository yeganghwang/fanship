import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createCompany(ceoId: number, createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { company_name, company_type, region } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({ where: { company_name } });
    if (existingCompany) {
      throw new ConflictException('Company name already exists');
    }

    // CEO 사용자 존재 여부는 UserService에서 확인하도록 하고, 여기서는 단순히 저장
    const newCompany = this.companyRepository.create({
      company_name,
      ceoId,
      company_type,
      region,
    });

    return this.companyRepository.save(newCompany);
  }

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
