import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './song/song.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SongModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CacheService],
})
export class AppModule {}
