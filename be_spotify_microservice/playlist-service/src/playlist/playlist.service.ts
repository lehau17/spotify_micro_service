import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SongDto } from 'src/common/dto/song/song.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}
  async create(createPlaylistDto: CreatePlaylistDto) {
    // check song
    const foundSong = await lastValueFrom<SongDto>(
      this.songService.send('findOneSong', createPlaylistDto.song_id),
    );
    if (!foundSong || foundSong.status === 'Disable') {
      throw new RpcException({
        message: 'Song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
