import { Injectable } from '@nestjs/common';
import { CreatePostBody } from './dto/request/createPostBody';
import { PostRepository } from './repository/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(body: CreatePostBody) {
    const post = await this.postRepository.create(body.toSchema());
    return post;
  }
}
