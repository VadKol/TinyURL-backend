import RedisCache from '../utils/cache';
import Logger from '../utils/logger';
import config from '../config';
import type { tinyUrl } from './urlService';
import type { RedisOptions } from 'ioredis';

const redisHost: string = config?.redis_host ?? 'localhost';
const redisPort: number = parseInt(config?.redis_port ?? '3000', 10);
const redisPassword: string = config?.redis_password ?? '';
const redisOptions: RedisOptions = {
  port: redisPort,
  host: redisHost,
  password: redisPassword
}
const redisCache = new RedisCache(Logger);
redisCache.connect(redisOptions);

export async function getCachedUrl(hashedKey: string): Promise<string | undefined> {
  const cachedUrl: string | undefined = await redisCache.get(hashedKey);
  return cachedUrl;
}

export async function cacheUrl(hashedKey: string, data: tinyUrl): Promise<boolean> {
  const response: boolean = await redisCache.save(hashedKey, JSON.stringify(data));
  return response;
}
