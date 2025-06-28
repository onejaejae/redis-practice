import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { User } from 'src/entities/user/user.entity';
import { CacheKeys } from 'src/core/cache/cache.interface';
import { Cache } from 'src/core/cache/cache.decorator';
import { RankService } from '../rank/rank.service';
import { GetUsersByRankDto } from './dto/request/getUsersByRank.dto';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly rankService: RankService,
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {}

  @Cache({ key: CacheKeys.User, ttl: 60 })
  async getUser(userId: User['id']) {
    const user = await this.userRepository.findByIdOrThrow(userId);

    return user;
  }

  async getUserRank(userId: User['id']) {
    try {
      return this.rankService.getUserRank(userId);
    } catch (error) {
      this.loggerService.error(
        this.getUserRank.name,
        error,
        'get user rank error from redis',
      );

      return this.userRepository.getUserRank(userId);
    }
  }

  async getUsersByRank(query: GetUsersByRankDto) {
    const { page, limit } = query;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const targetUserIds = await this.rankService.getUsersByRankRange(
      start,
      end,
    );

    return this.userRepository.findByIds(targetUserIds);
  }

  async updateScore(userId: User['id'], score: User['score']) {
    const user = await this.userRepository.findByIdOrThrow(userId);
    user.score = score;

    await Promise.all([
      this.userRepository.save(user),
      this.rankService.updateUserRank(userId, score),
    ]);
  }
}
