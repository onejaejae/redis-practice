import { SetMetadata } from '@nestjs/common';
import { ICacheOptions } from './cache.interface';

export const CACHE_KEY = 'CACHE';

export const Cache = (options: ICacheOptions) => {
  return SetMetadata(CACHE_KEY, options);
};
