import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaylistResponse } from './dto/playlist-response.dto';
import { lastValueFrom } from 'rxjs';
import { SongDto } from './dto/create-playlist.dto';
import { ClientProxy } from '@nestjs/microservices';
import { playlists } from '@prisma/client';

@Injectable()
class PlaylistServiceVer2 {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}

  async findOne(id: number) {
    const playlistFound = await this.prismaService.playlists.findUnique({
      where: {
        id,
      },
    });
    const song_details = await lastValueFrom(
      this.songService.send<SongDto[]>(
        'getListSongReturnArray',
        playlistFound.songs as Number[],
      ),
    );
    console.log('Check ', song_details);
    return {
      ...playlistFound,
      song_details,
    };
  }
}

export default PlaylistServiceVer2;
