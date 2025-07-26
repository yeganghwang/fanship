import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Celeb } from '../celeb/celeb.entity';
import { Company } from '../company/company.entity';
import { Comment } from '../comment/comment.entity';

@Entity('tb_user')
@Unique(['username'])
@Unique(['mail'])
@Unique(['nickname'])
@Unique(['ig_url'])
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ length: 255, nullable: false })
  username: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @Column({ length: 255, nullable: false })
  mail: string;

  @Column({ length: 12, nullable: false })
  nickname: string;

  @Column({ type: 'date', nullable: true })
  dob: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pfp_img_url: string | null;

  @CreateDateColumn({ name: 'join_date', type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ig_url: string | null;

  @Column({ length: 31, nullable: false })
  position: string;

  @Column({ name: 'company_id', type: 'int', nullable: true })
  company_id: number | null;

  @Column({ name: 'celeb_type', type: 'varchar', length: 64, nullable: true })
  celeb_type: string | null;

  @OneToOne(() => Celeb, celeb => celeb.user)
  celeb: Celeb;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Comment, comment => comment.writer)
  comments: Comment[];
}
