import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

export enum Status {
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  DRAFT = 'draft',
}

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true, default: null })
  imageUrl: string | null;

  @Column({default: false})
  isPinned: boolean;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PUBLISHED,
  })
  status: Status;

  @Column({ type: 'timestamp', nullable: true, default: null })
  scheduledFor: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { eager: true, nullable: false })
  author: User;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;
}
