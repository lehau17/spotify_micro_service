import { Inject, Injectable } from '@nestjs/common';
import { CreateRecentSongDto } from './dto/create-recent-song.dto';
import { UpdateRecentSongDto } from './dto/update-recent-song.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PagingDto } from 'src/common/paging/paging.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class RecentSongService {
  constructor(
    @Inject('RECENT_SONG_SERVICE') private readonly recentSong: ClientProxy,
  ) {}
  create(createRecentSongDto: CreateRecentSongDto, user_id: number) {
    return lastValueFrom(
      this.recentSong
        .send('createRecentSong', {
          ...createRecentSongDto,
          user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: PagingDto, user_id: number) {
    return lastValueFrom(
      this.recentSong
        .send('findAllRecentSongByUser', {
          ...paging,
          user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.recentSong
        .send('findOneRecentSong', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateRecentSongDto: UpdateRecentSongDto) {
    return lastValueFrom(
      this.recentSong
        .send('updateRecentSong', { id, ...updateRecentSongDto })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.recentSong
        .send('removeRecentSong', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
