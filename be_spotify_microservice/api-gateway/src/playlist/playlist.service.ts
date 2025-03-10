import { Inject, Injectable } from '@nestjs/common';
import { CreatePlaylistDto, SongDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject('PLAYLIST_SERVICE') private readonly playlistService: ClientProxy,
  ) {}
  create(createPlaylistDto: CreatePlaylistDto, user_id: number) {
    console.log('Checking playlist', createPlaylistDto, user_id);
    return lastValueFrom(
      this.playlistService
        .send('createPlaylist', { ...createPlaylistDto, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: PagingDto, user_id: number) {
    return lastValueFrom(
      this.playlistService
        .send('findAllPlaylist', { ...paging, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.playlistService
        .send('findOnePlaylist', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async addSongToPlaylist({
    song_ids,
    id,
    user_id,
  }: {
    song_ids: number[];
    id: number;
    user_id: number;
  }) {
    return lastValueFrom(
      this.playlistService
        .send('addSongToPlaylist', { id, user_id, song_ids })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async removeSongToPlaylist(body: {
    song_id: number;
    playlist_id: number;
    user_id: number;
  }) {
    return lastValueFrom(
      this.playlistService
        .send('removeSongToPlaylist', body)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.playlistService
        .send('removePlaylist', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
