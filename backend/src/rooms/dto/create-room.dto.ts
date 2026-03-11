import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
