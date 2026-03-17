import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString, IsUUID } from 'class-validator';
import {Status} from "../post.entity";

export class CreatePostDto {
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    isPinned?: boolean;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsDateString()
    scheduledFor?: Date;

    @IsOptional()
    @IsUUID()
    roomId?: string;
}
