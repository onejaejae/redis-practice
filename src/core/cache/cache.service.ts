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
    const data = await this.redis.get(key);
    if (data) {
      return JSON.parse(data);
    }

    return null;
  }

  public async set(
    key: string,
    value: string | number | boolean,
    ttl?: number,
  ) {
    const serializedValue = JSON.stringify(value);

    await this.redis.set(key, serializedValue);
    await this.setTTL(key, ttl);
  }

  public async del(key: string) {
    await this.redis.del(key);
  }

  public async zadd(key: string, score: number, value: string) {
    return this.redis.zadd(key, score, value);
  }

  public async zrevrank(key: string, value: string): Promise<number | null> {
    const rank = await this.redis.zrevrank(key, value);

    return rank !== null ? rank + 1 : null;
  }

  public async zrevrange(key: string, start: number, end: number) {
    return this.redis.zrevrange(key, start, end);
  }
}
