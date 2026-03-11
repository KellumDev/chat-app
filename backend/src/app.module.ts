import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { GatewayModule } from './gateway/gateway.module';
import { User } from './users/user.entity';
import { Room } from './rooms/room.entity';
import { Message } from './messages/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'chatuser',
      password: process.env.DB_PASSWORD || 'chatpassword',
      database: process.env.DB_NAME || 'chatapp',
      entities: [User, Room, Message],
      synchronize: true, // Auto-creates tables — disable in production
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
    GatewayModule,
  ],
})
export class AppModule {}
