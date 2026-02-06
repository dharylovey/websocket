import { PostStatus } from '../types/post.types';

export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  status!: PostStatus;
  authorId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(post: {
    id: string;
    title: string;
    content: string;
    status: string;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.status = post.status as PostStatus;
    this.authorId = post.authorId;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
