import { Union } from 'src/common/type/common.interface';

export const CacheServiceKey = Symbol('CacheServiceKey');
export const RedisClientKey = Symbol('RedisClientKey');

export const CacheKeys = {
  RefreshToken: 'refresh-token/',
  TokenBlacklist: 'token-blacklist/',
  User: 'user/',
  UserRank: 'user-rank/',
} as const;
export type CacheKeys = Union<typeof CacheKeys>;

export interface ICacheOptions {
  key: string;
  ttl: number;
  index?: number;
}
