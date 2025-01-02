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
  ) {}
  create(createSongDto: CreateSongDto, id: number) {
    return lastValueFrom(
      this.songService
        .send('taoBaiHat', { ...createSongDto, user_id: id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: PagingDto) {
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

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
