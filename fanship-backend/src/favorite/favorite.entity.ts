import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { Celeb } from '../celeb/celeb.entity';

@Entity('tb_user_fav') // 테이블 이름 지정
@Unique(['userId', 'companyId', 'celebId']) // 복합 유니크 제약 조건
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'celeb_id', nullable: true })
  celebId: number;

  @ManyToOne(() => Celeb)
  @JoinColumn({ name: 'celeb_id' })
  celeb: Celeb;
}
