import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { User } from 'src/entities/user/user.entity';
import { CacheService } from 'src/core/cache/cache.service';
import { CacheServiceKey } from 'src/core/cache/cache.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(CacheServiceKey) private readonly cacheService: CacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(userId: User['id']) {
    const user = await this.userRepository.findByIdOrThrow(userId);

    return user;
  }
}
