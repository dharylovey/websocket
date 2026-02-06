import { PostResponseDto } from '../../posts/dto/post-response.dto';

export enum WsEventType {
  POST_CREATED = 'posts.created',
  POST_UPDATED = 'posts.updated',
  POST_DELETED = 'posts.deleted',
  CONNECTION_ACK = 'connection.ack',
  ERROR = 'error',
}

export interface WsEvent<T = unknown> {
  type: WsEventType;
  timestamp: string;
  data: T;
  requestId?: string;
}

export interface PostCreatedEvent {
  post: PostResponseDto;
}

export interface PostUpdatedEvent {
  post: PostResponseDto;
}

export interface PostDeletedEvent {
  postId: string;
}

export interface ConnectionAckEvent {
  message: string;
  clientId: string;
}

export interface ErrorEvent {
  message: string;
  code?: string;
}
