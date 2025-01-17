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
      const listSong = await lastValueFrom<Record<number, SongDto>>(
        this.songService.send('getListSong', songIds),
      );

      dataResponse = {
        ...playlistFound,
        songs: songIds.map((songId) => listSong[songId]), // Đóng ngoặc đúng cách
      };
    } else {
      dataResponse = {
        ...playlistFound,
        songs: [],
      };
    }

    return dataResponse;
  }
}

export default PlaylistServiceVer2;
