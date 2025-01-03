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
import { AccessTokenStrategy } from './common/stategy/accessToken.stategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FolowingModule } from './folowing/folowing.module';
import { GerneModule } from './gerne/gerne.module';
import { UpdateModule } from './update/update.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SongModule } from './song/song.module';
import { DiscussModule } from './discuss/discuss.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Đảm bảo đường dẫn đúng
      serveRoot: '/uploads', // URL public của thư mục
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ConfigModule.forRoot(), // Cấu hình .env
    ThrottlerModule.forRoot(),
    JwtModule.register({ global: true }),
    FolowingModule,
    GerneModule,
    UpdateModule,
    SongModule,
    DiscussModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisThrottlerStorageService,
    AccessTokenStrategy,
    JwtService,
  ],
})
export class AppModule {}
