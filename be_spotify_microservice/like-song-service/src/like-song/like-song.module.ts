import { Module } from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { LikeSongController } from './like-song.controller';

@Module({
  controllers: [LikeSongController],
  providers: [LikeSongService],
})
export class LikeSongModule {}
