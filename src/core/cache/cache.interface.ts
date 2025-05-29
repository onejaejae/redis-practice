export const CacheServiceKey = Symbol('CacheServiceKey');
export const RedisClientKey = Symbol('RedisClientKey');

export interface ICacheOptions {
  key: string;
  ttl: number;
}
