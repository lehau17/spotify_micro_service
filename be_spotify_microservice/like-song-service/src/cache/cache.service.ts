import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit {
  private static redis: Redis;
  private logger: Logger;
  private configService: ConfigService;
  onModuleInit() {
    this.logger = new Logger(CacheService.name);
    this.configService = new ConfigService();
    CacheService.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,

      db: 0,
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
    this.logger.fatal('init cache service');
  }

  // Phương thức để lấy Redis instance
  static getClient(): Redis {
    if (this.redis) {
      console.log('tra tu context');
      return this.redis;
    }
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      db: 0,
    });
    return this.redis;
  }

  onModuleDestroy() {
    CacheService.redis.quit();
  }
}
