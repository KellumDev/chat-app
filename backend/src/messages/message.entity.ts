import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  author: User;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;
}
