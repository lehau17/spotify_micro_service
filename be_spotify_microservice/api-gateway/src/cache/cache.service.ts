import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit {
  private redis: Redis;
  private logger: Logger;
  onModuleInit() {
    this.logger = new Logger(CacheService.name);
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
    });
    this.logger.fatal('init cache service');
  }

  // Phương thức để lấy Redis instance
  getClient(): Redis {
    return this.redis;
  }

  onModuleDestroy() {
    this.redis.quit();
  }
}
