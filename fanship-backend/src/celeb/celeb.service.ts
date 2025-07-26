import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celeb } from './celeb.entity';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';

@Injectable()
export class CelebService {
  constructor(
    @InjectRepository(Celeb)
    private celebRepository: Repository<Celeb>,
    private companyService: CompanyService,
  ) {}

  async findCelebsByCompanyId(companyId: number): Promise<any[]> {
    const company = await this.companyService.findOneById(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.celebRepository
      .createQueryBuilder('celeb')
      .leftJoinAndSelect('celeb.user', 'user')
      .where('celeb.companyId = :companyId', { companyId })
      .select([
        'celeb.celebId',
        'user.nickname',
        'celeb.celeb_type',
      ])
      .getMany();
  }

  async findOneById(celebId: number): Promise<any> {
    const celeb = await this.celebRepository
      .createQueryBuilder('celeb')
      .leftJoinAndSelect('celeb.user', 'user')
      .leftJoinAndSelect('celeb.company', 'company')
      .where('celeb.celebId = :celebId', { celebId })
      .select([
        'celeb.celebId',
        'user.nickname',
        'celeb.celeb_type',
        'company.company_name',
        'user.ig_url',
        'user.pfp_img_url',
        'user.dob',
      ])
      .getOne();

    if (!celeb) {
      throw new NotFoundException(`Celeb with ID ${celebId} not found`);
    }

    return {
      nickname: celeb.user.nickname,
      celeb_type: celeb.celeb_type,
      company_name: celeb.company.company_name,
      ig_url: celeb.user.ig_url,
      pfp_img_url: celeb.user.pfp_img_url,
      dob: celeb.user.dob,
    };
  }
}
