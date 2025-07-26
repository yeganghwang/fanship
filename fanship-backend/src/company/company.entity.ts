import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('tb_company') // 테이블 이름 지정
@Unique(['company_name']) // company_name 필드에 Unique 제약 조건 추가
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 127, nullable: false })
  company_name: string;

  @Column({ name: 'ceo_id', nullable: false })
  ceoId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ceo_id' })
  ceo: User;

  @Column({ length: 64, nullable: false })
  company_type: string;

  @Column({ length: 8, nullable: false })
  region: string;
}
