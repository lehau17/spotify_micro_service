import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecentSongService } from './recent-song.service';
import { CreateRecentSongDto } from './dto/create-recent-song.dto';
import { UpdateRecentSongDto } from './dto/update-recent-song.dto';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller()
export class RecentSongController {
  constructor(private readonly recentSongService: RecentSongService) {}

  @MessagePattern('createRecentSong')
  create(@Payload() createRecentSongDto: CreateRecentSongDto) {
    return this.recentSongService.create(createRecentSongDto);
  }

  @MessagePattern('findAllRecentSongByUser')
  findAll(@Payload() paging: PagingDto & { user_id: number }) {
    return this.recentSongService.findAll(paging);
  }

  @MessagePattern('findOneRecentSong')
  findOne(@Payload() id: number) {
    return this.recentSongService.findOne(id);
  }

  @MessagePattern('updateRecentSong')
  update(@Payload() updateRecentSongDto: UpdateRecentSongDto) {
    return this.recentSongService.update(updateRecentSongDto);
  }

  @MessagePattern('removeRecentSong')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.recentSongService.remove(id, user_id);
  }
}
