import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Entity('tb_post') // 테이블 이름 지정
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'writer_id', nullable: false })
  writerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'writer_id' })
  writer: User;

  @Column({ length: 128, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: true, default: false })
  notice: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  visible: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  views: number;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
