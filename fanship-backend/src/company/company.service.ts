import { Injectable, ConflictException, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserService } from '../user/user.service';
import { PaginatedResult, PaginationHelper } from '../common/interfaces/pagination.interface';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async createCompany(ceoId: number, createCompanyDto: CreateCompanyDto): Promise<any> {
    const { company_name, company_type, region } = createCompanyDto;

    // CEO 권한 확인
    const user = await this.userService.findOneByUserId(ceoId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.position !== 'ceo') {
      throw new ForbiddenException('Only users with CEO position can create companies');
    }

    const existingCompany = await this.companyRepository.findOne({ where: { company_name } });
    if (existingCompany) {
      throw new ConflictException('Company name already exists');
    }

    const newCompany = this.companyRepository.create({
      company_name,
      ceoId,
      company_type,
      region,
    });

    const savedCompany = await this.companyRepository.save(newCompany);

    // api.md 명세에 맞는 응답 형식으로 변환
    return {
      company_id: savedCompany.id,
      company_name: savedCompany.company_name,
      ceo_id: savedCompany.ceoId,
      company_type: savedCompany.company_type,
      region: savedCompany.region,
    };
  }

  async findAll(region?: string, companyName?: string, page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const query = this.companyRepository.createQueryBuilder('company');

    const conditions: string[] = [];
    const parameters: any = {};

    if (region) {
      conditions.push('company.region = :region');
      parameters['region'] = region;
    }

    if (companyName) {
      conditions.push('company.company_name LIKE :companyName');
      parameters['companyName'] = `%${companyName}%`;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), parameters);
    }

    // 총 개수 조회
    const totalItems = await query.getCount();

    // 페이지네이션 적용
    const { skip, take } = PaginationHelper.getSkipAndTake(page, limit);
    query.skip(skip).take(take);

    const companies = await query.getMany();
    
    const list = companies.map(company => ({
      company_id: company.id,
      company_name: company.company_name,
      ceo_id: company.ceoId,
      company_type: company.company_type,
      region: company.region,
    }));

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      list,
      pagination,
    };
  }

  async findOneById(companyId: number): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { id: companyId } });
  }
}
