import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { WsService } from '../ws/ws.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostsDto } from './dto/list-posts.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PaginatedResult } from './types/post.types';
import { WsEventType } from '../ws/types/ws-event.types';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly wsService: WsService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    requestId?: string,
  ): Promise<PostResponseDto> {
    const post = await this.postsRepository.create(createPostDto);

    // Broadcast creation event
    this.wsService.broadcast({
      type: WsEventType.POST_CREATED,
      timestamp: new Date().toISOString(),
      data: { post },
      requestId,
    });

    return post;
  }

  async findAll(
    listPostsDto: ListPostsDto,
  ): Promise<PaginatedResult<PostResponseDto>> {
    const { page = 1, limit = 10, status, search } = listPostsDto;
    return this.postsRepository.findAll(page, limit, status, search);
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    requestId?: string,
  ): Promise<PostResponseDto> {
    const post = await this.postsRepository.update(id, updatePostDto);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Broadcast update event
    this.wsService.broadcast({
      type: WsEventType.POST_UPDATED,
      timestamp: new Date().toISOString(),
      data: { post },
      requestId,
    });

    return post;
  }

  async delete(id: string, requestId?: string): Promise<void> {
    const exists = await this.postsRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postsRepository.delete(id);

    // Broadcast deletion event
    this.wsService.broadcast({
      type: WsEventType.POST_DELETED,
      timestamp: new Date().toISOString(),
      data: { postId: id },
      requestId,
    });
  }
}
