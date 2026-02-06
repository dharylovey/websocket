import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../types/post.types';

export class ListPostsDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @IsEnum(PostStatus, {
    message: 'Status must be one of: draft, published, archived',
  })
  @IsOptional()
  status?: PostStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
