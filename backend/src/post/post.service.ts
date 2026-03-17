import {Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Post} from "./post.entity";
import {User} from "../users/user.entity";
import {Room} from "../rooms/room.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) {
    }

    async create(createPostDto: CreatePostDto): Promise<Post | string> {
        const user = await this.userRepository.findOne({where: {id: createPostDto.userId}});
        const room = await this.roomRepository.findOne({where: {id: createPostDto.roomId}});

        if (!user) {
            return 'User not found';
        }

        if (!room) {
            return 'Room not found';
        }
        const post = this.postRepository.create({
            ...createPostDto,
            title: createPostDto.title,
            author: user,
            room: room,
        });
        return this.postRepository.save(post);
    }

    async findAll() {

        const posts = await this.postRepository.find();

        if (posts.length > 0) return `You have no posts yet`;

        return posts;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    async remove(id: string) {
        const post = await this.postRepository.findOne({where: {id: id}});

        if (!post) return `Post not found`;

        await this.postRepository.remove(post);

        return `success`;
    }
}
