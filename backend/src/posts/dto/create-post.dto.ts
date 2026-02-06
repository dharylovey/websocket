import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '../types/post.types';

export class CreatePostDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(160, { message: 'Title must not exceed 160 characters' })
  title!: string;

  @IsString()
  @MinLength(1, { message: 'Content cannot be empty' })
  content!: string;

  @IsEnum(PostStatus, {
    message: 'Status must be one of: draft, published, archived',
  })
  @IsOptional()
  status?: PostStatus;

  @IsUUID('4', { message: 'Author ID must be a valid UUID' })
  @IsOptional()
  authorId?: string;
}
