import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeSongModule } from './like-song/like-song.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LikeSongModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, PrismaService],
})
export class AppModule {}
