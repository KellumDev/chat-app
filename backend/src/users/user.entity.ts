import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Message } from '../messages/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Room, (room) => room.members)
  rooms: Room[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];
}
