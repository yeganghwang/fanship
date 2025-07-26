import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Celeb } from '../celeb/celeb.entity';

@Entity('tb_schedule') // 테이블 이름 지정
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'celeb_id', nullable: false })
  celebId: number;

  @ManyToOne(() => Celeb)
  @JoinColumn({ name: 'celeb_id' })
  celeb: Celeb;

  @Column({ length: 64, nullable: false })
  schedule_type: string;

  @Column({ type: 'datetime', nullable: false })
  start_dt: Date;

  @Column({ type: 'datetime', nullable: true })
  end_dt: Date;
}
