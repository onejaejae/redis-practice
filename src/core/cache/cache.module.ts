import { ClassProvider, FactoryProvider, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheService } from './cache.service';
import { CacheServiceKey, RedisClientKey } from './cache.interface';

const redisConnect: FactoryProvider = {
  provide: RedisClientKey,
  useFactory: async () => {
    const client = new Redis({
      port: 6379,
      host: '127.0.0.1',
    });
    return client;
  },
};

const cacheService: ClassProvider = {
  provide: CacheServiceKey,
  useClass: CacheService,
};

@Module({
  providers: [redisConnect, cacheService],
  exports: [cacheService],
})
export class CacheModule {}
