import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rooms/:roomId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findByRoom(@Param('roomId') roomId: string) {
    return this.messagesService.findByRoom(roomId);
  }
}
