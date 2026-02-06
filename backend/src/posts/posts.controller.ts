import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostsDto } from './dto/list-posts.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PaginatedResult } from './types/post.types';

@Controller('api/v1/posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: FastifyRequest,
  ): Promise<PostResponseDto> {
    this.logger.log(`Creating post: ${createPostDto.title} [${req.requestId}]`);
    return this.postsService.create(createPostDto, req.requestId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() listPostsDto: ListPostsDto,
  ): Promise<PaginatedResult<PostResponseDto>> {
    this.logger.log(
      `Fetching posts - Page: ${listPostsDto.page}, Limit: ${listPostsDto.limit}`,
    );
    return this.postsService.findAll(listPostsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    this.logger.log(`Fetching post with ID: ${id}`);
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: FastifyRequest,
  ): Promise<PostResponseDto> {
    this.logger.log(`Updating post with ID: ${id} [${req.requestId}]`);
    return this.postsService.update(id, updatePostDto, req.requestId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
  ): Promise<void> {
    this.logger.log(`Deleting post with ID: ${id} [${req.requestId}]`);
    await this.postsService.delete(id, req.requestId);
  }
}
