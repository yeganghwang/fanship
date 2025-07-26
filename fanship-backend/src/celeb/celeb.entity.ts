import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';

@Entity('tb_celeb') // 테이블 이름 지정
export class Celeb {
  @PrimaryGeneratedColumn({ name: 'celeb_id' })
  celebId: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'company_id', nullable: false })
  companyId: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 64, nullable: false })
  celeb_type: string;
}
