import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { User } from 'src/entities/user/user.entity';
import { CacheService } from 'src/core/cache/cache.service';
import { CacheKeys, CacheServiceKey } from 'src/core/cache/cache.interface';
import { Cache } from 'src/core/cache/cache.decorator';

@Injectable()
export class UserService {
  constructor(
    @Inject(CacheServiceKey) private readonly cacheService: CacheService,
    private readonly userRepository: UserRepository,
  ) {}

  @Cache({ key: CacheKeys.User, ttl: 60 })
  async getUser(userId: User['id']) {
    const user = await this.userRepository.findByIdOrThrow(userId);

    return user;
  }
}
