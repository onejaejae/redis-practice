import { plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';
import { Post } from 'src/schemas/post/post.schema';

export class CreatePostBody {
  @IsString()
  title: string;

  @IsString()
  content: string;

  toSchema(): Post {
    return plainToInstance(Post, this);
  }
}
