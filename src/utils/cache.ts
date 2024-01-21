import IORedis from 'ioredis';
import type { RedisOptions, Redis as IRedis } from 'ioredis';
import type { ILogger } from './logger';

class RedisCache {
  private logger: ILogger;
  private redis!: IRedis; 

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public connect(options: RedisOptions): void {
    if (this.redis) {
      return;
    }
    this.redis = new IORedis(options);
    this.logger.info('Redis connected');
  }

  public async get(cacheKey: string): Promise<string | undefined> {
    if (!this.redis) {
      this.logger.error('No redis connection found');
    }
    const info = await this.redis.get(cacheKey);
    const response = info ?? undefined;
    return response;
  }

  public async save(cacheKey: string, value: string, expirationTime?: number): Promise<boolean> {
    if (!this.redis) {
      this.logger.error('No redis connection found');
    }
    const storedInfo = await this.redis.set(cacheKey, value);
    this.redis.expire(cacheKey, expirationTime ?? 24 * 60 * 60);
    const response = storedInfo === 'OK' ? true : false;
    return response;
  }

  public disconnect(): void {
    if (!this.redis) {
      this.logger.error('No redis connection found');
    }
    this.redis.disconnect();
    this.logger.info('Redis disconnected');
  }
}

export default RedisCache;
