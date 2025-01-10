import { Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class SongService {
  constructor(
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
    @Inject('LIKESONG_SERVICE') private readonly likeSongService: ClientProxy,
  ) {}
  create(createSongDto: CreateSongDto, id: number) {
    return lastValueFrom(
      this.songService
        .send('taoBaiHat', { ...createSongDto, user_id: id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listLike(song_id: number, paging: PagingDto) {
    return lastValueFrom(
      this.likeSongService
        .send('findAllLikeSong', { ...paging, song_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listDeXuatBaiHat(paging: PagingDto) {
    return lastValueFrom(
      this.songService
        .send('listDeXuatBaiHat', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listMySong(paging: PagingDto, user_id: number) {
    return lastValueFrom(
      this.songService
        .send('listMySong', { ...paging, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listPopularSong(paging: PagingDto) {
    return lastValueFrom(
      this.songService
        .send('listPopularSong', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.songService
        .send('findOneSong', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return lastValueFrom(
      this.songService
        .send('updateSong', { ...updateSongDto, id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.songService
        .send('removeSong', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
