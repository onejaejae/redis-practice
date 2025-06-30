import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostBody } from './dto/request/createPostBody';

@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('/')
  async createPost(@Body() body: CreatePostBody) {
    return this.service.createPost(body);
  }
}
