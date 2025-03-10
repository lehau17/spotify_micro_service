import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { RecentSongModule } from './recent-song/recent-song.module';

@Module({
  imports: [
    PrismaModule,
    RecentSongModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
