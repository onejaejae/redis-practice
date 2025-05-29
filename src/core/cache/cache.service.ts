import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClientKey } from './cache.interface';
@Injectable()
export class CacheService {
  constructor(@Inject(RedisClientKey) private readonly redis: Redis) {}

  private async setTTL(key: string, ttl: number = 0) {
    return this.redis.expire(key, ttl);
  }

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async set(key: string, value: any, ttl?: number) {
    await this.redis.set(key, value);
    await this.setTTL(key, ttl);
  }

  public async del(key: string) {
    await this.redis.del(key);
  }
}
