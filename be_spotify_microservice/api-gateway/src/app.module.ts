import { ExecutionContext, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';
import { RedisThrottlerStorageService } from './RedisThrottlerStorage/throttler-redis.service';
import { GlobalThrottlerGuard } from './common/guards/global.rate_limit.guard';
import { PublicThrottlerGuard } from './common/guards/public.rate_limiter.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ConfigModule.forRoot(), // Cấu hình .env
    ThrottlerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, RedisThrottlerStorageService],
})
export class AppModule {}
