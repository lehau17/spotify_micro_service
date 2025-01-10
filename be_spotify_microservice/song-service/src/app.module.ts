import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './song/song.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SongModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CacheService],
})
export class AppModule {}
