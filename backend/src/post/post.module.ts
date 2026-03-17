import {Module} from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Post } from './post.entity';
import {User} from "../users/user.entity";
import {Room} from "../rooms/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Room])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
