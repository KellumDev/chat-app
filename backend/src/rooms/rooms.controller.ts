import {
  Controller, Get, Post, Delete, Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    return this.roomsService.create(createRoomDto, req.user);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.roomsService.joinRoom(id, req.user);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @Request() req) {
    return this.roomsService.leaveRoom(id, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.roomsService.deleteRoom(id, req.user);
  }
}
