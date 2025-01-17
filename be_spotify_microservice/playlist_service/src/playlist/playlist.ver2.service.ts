import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaylistResponse } from './dto/playlist-response.dto';
import { lastValueFrom } from 'rxjs';
import { SongDto } from './dto/create-playlist.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
class PlaylistServiceVer2 {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}

  async findOne(id: number): Promise<PlaylistResponse> {
    const playlistFound = await this.prismaService.playlists.findUnique({
      where: {
        id,
      },
    });

    let dataResponse: PlaylistResponse;
    const songIds = playlistFound.songs as number[];
    delete playlistFound.songs;

    // call service playlistsong
    if (songIds.length > 0) {
      const listSong = await lastValueFrom<SongDto[]>(
        this.songService.send('getListSongReturnArray', songIds),
      );

      dataResponse = {
        ...playlistFound,
        songs: listSong,
      };
    } else {
      dataResponse = {
        ...playlistFound,
        songs: [],
      };
    }
    console.log('Check data response', dataResponse);

    return dataResponse;
  }
}

export default PlaylistServiceVer2;
