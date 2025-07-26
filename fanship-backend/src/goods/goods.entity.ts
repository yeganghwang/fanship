import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('tb_goods') // 테이블 이름 지정
export class Goods {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'seller_id', nullable: false })
  sellerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ length: 128, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: false, default: true })
  visible: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  views: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  sold: boolean;
}
