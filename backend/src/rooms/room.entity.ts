import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../messages/message.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @ManyToMany(() => User, (user) => user.rooms, { eager: true })
  @JoinTable()
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
