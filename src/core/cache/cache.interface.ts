import { Union } from 'src/common/type/common.interface';

export const CacheServiceKey = Symbol('CacheServiceKey');
export const RedisClientKey = Symbol('RedisClientKey');

export const CacheKeys = {
  User: 'user/',
} as const;
export type CacheKeys = Union<typeof CacheKeys>;

export interface ICacheOptions {
  key: string;
  ttl: number;
  index?: number;
}
