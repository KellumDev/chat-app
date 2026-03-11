import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { User } from '../users/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto, user: User): Promise<Room> {
    const room = this.roomsRepository.create({
      ...createRoomDto,
      createdBy: user,
      members: [user],
    });
    return this.roomsRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
      where: { isPrivate: false },
      relations: ['createdBy', 'members'],
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'members'],
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async joinRoom(roomId: string, user: User): Promise<Room> {
    const room = await this.findOne(roomId);
    const alreadyMember = room.members.some((m) => m.id === user.id);
    if (!alreadyMember) {
      room.members.push(user);
      await this.roomsRepository.save(room);
    }
    return room;
  }

  async leaveRoom(roomId: string, user: User): Promise<void> {
    const room = await this.findOne(roomId);
    room.members = room.members.filter((m) => m.id !== user.id);
    await this.roomsRepository.save(room);
  }

  async deleteRoom(roomId: string, user: User): Promise<void> {
    const room = await this.findOne(roomId);
    if (room.createdBy.id !== user.id) {
      throw new ForbiddenException('Only the room creator can delete it');
    }
    await this.roomsRepository.remove(room);
  }
}
