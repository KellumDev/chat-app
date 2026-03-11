import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track connected users: socketId -> user info
  private connectedUsers = new Map<string, { userId: string; username: string }>();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return client.disconnect();

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) return client.disconnect();

      this.connectedUsers.set(client.id, { userId: user.id, username: user.username });
      this.server.emit('user:online', { userId: user.id, username: user.username });
      console.log(`✅ Client connected: ${user.username}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.server.emit('user:offline', { userId: user.userId });
      this.connectedUsers.delete(client.id);
      console.log(`❌ Client disconnected: ${user.username}`);
    }
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.join(data.roomId);
    const messages = await this.messagesService.findByRoom(data.roomId);
    client.emit('messages:history', messages);
    client.to(data.roomId).emit('room:user_joined', {
      user: this.connectedUsers.get(client.id),
    });
  }

  @SubscribeMessage('room:leave')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.leave(data.roomId);
    client.to(data.roomId).emit('room:user_left', {
      user: this.connectedUsers.get(client.id),
    });
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string },
  ) {
    const userInfo = this.connectedUsers.get(client.id);
    if (!userInfo) return;

    const user = await this.usersService.findById(userInfo.userId);
    const room = await this.roomsService.findOne(data.roomId);

    if (!user || !room) return;

    const message = await this.messagesService.create(data.content, user, room);

    // Broadcast to everyone in the room (including sender)
    this.server.to(data.roomId).emit('message:new', {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      author: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      roomId: data.roomId,
    });
  }

  @SubscribeMessage('message:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const user = this.connectedUsers.get(client.id);
    client.to(data.roomId).emit('message:typing', { user, isTyping: data.isTyping });
  }
}
