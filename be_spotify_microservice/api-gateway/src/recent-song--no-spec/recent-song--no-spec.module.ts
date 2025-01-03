import { Module } from '@nestjs/common';
import { RecentSongNoSpecService } from './recent-song--no-spec.service';
import { RecentSongNoSpecController } from './recent-song--no-spec.controller';

@Module({
  controllers: [RecentSongNoSpecController],
  providers: [RecentSongNoSpecService],
})
export class RecentSongNoSpecModule {}
