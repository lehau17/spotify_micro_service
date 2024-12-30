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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ConfigModule.forRoot(), // Cấu hình .env
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        return {
          // storage: new RedisThrottlerStorageService(),
          throttlers: [{ ttl: 60, limit: 5, name: 'rate-limit:global' }],
          getTracker: (req: Record<string, any>, context: ExecutionContext) =>
            'rate-limit:global',
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisThrottlerStorageService,
    {
      provide: 'APP_GUARD', // Đặt guard toàn cục
      useClass: GlobalThrottlerGuard,
    },
  ],
})
export class AppModule {}
