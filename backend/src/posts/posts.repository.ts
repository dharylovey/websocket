import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '../db/drizzle.service';
import { posts } from '../db/schema/posts.schema';
import { eq, and, sql, ilike, desc } from 'drizzle-orm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus, PaginatedResult } from './types/post.types';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsRepository {
  private readonly logger = new Logger(PostsRepository.name);

  constructor(private readonly drizzle: DrizzleService) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const [post] = await this.drizzle.db
      .insert(posts)
      .values({
        title: createPostDto.title,
        content: createPostDto.content,
        status: createPostDto.status || PostStatus.DRAFT,
        authorId: createPostDto.authorId || null,
      })
      .returning();

    this.logger.log(`Created post with ID: ${post.id}`);
    return new PostResponseDto(post);
  }

  async findAll(
    page: number,
    limit: number,
    status?: PostStatus,
    search?: string,
  ): Promise<PaginatedResult<PostResponseDto>> {
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(posts.status, status));
    }
    if (search) {
      conditions.push(ilike(posts.title, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count }] = await this.drizzle.db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(whereClause);

    // Get paginated results
    const results = await this.drizzle.db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(count / limit);

    return {
      data: results.map((post) => new PostResponseDto(post)),
      meta: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<PostResponseDto | null> {
    const [post] = await this.drizzle.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return null;
    }

    return new PostResponseDto(post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto | null> {
    const updateData: Record<string, unknown> = {
      ...updatePostDto,
      updatedAt: new Date(),
    };

    const [post] = await this.drizzle.db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    if (!post) {
      return null;
    }

    this.logger.log(`Updated post with ID: ${id}`);
    return new PostResponseDto(post);
  }

  async delete(id: string): Promise<boolean> {
    // Hard delete - justification: simpler for this example, no audit requirements
    // For production with audit needs, implement soft delete with deletedAt timestamp
    const result = await this.drizzle.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    const deleted = result.length > 0;
    if (deleted) {
      this.logger.log(`Deleted post with ID: ${id}`);
    }

    return deleted;
  }

  async exists(id: string): Promise<boolean> {
    const [result] = await this.drizzle.db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.id, id));

    return result.count > 0;
  }
}
