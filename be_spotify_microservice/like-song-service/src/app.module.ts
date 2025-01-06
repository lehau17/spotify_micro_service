import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeSongModule } from './like-song/like-song.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LikeSongModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
