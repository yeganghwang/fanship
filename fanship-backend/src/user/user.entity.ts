import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, OneToMany } from 'typeorm';
import { Celeb } from '../celeb/celeb.entity';
import { Company } from '../company/company.entity'
import { Comment } from '../comment/comment.entity';
import { Goods } from '../goods/goods.entity';
import { Expose, Transform, Exclude } from 'class-transformer';
import { format } from 'date-fns';

@Entity('tb_user')
@Unique(['username'])
@Unique(['mail'])
@Unique(['nickname'])
@Unique(['ig_url'])
export class User {
  @Expose({ name: 'user_id' })
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

  @Transform(({ value }) => value ? format(value, 'yyyy-MM-dd') : null)
  @Column({ type: 'date', nullable: true })
  dob: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pfp_img_url: string | null;

  @Expose({ name: 'join_dt' })
  @Transform(({ value }) => value ? value.toISOString() : null) // Keep ISO string for join_dt as per api.md
  @CreateDateColumn({ name: 'join_date', type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ig_url: string | null;

  @Column({ length: 31, nullable: false })
  position: string;

  @OneToOne(() => Celeb, celeb => celeb.user)
  celeb: Celeb;

  @OneToMany(() => Comment, comment => comment.writer)
  comments: Comment[];


  @OneToMany(() => Goods, goods => goods.seller)
  goods: Goods[];
}
