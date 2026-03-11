import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(content: string, author: User, room: Room): Promise<Message> {
    const message = this.messagesRepository.create({ content, author, room });
    return this.messagesRepository.save(message);
  }

  async findByRoom(roomId: string, limit = 50): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
}
