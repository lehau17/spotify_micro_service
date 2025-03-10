import { map } from 'rxjs/operators';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePlaylistDto, SongDto } from './dto/create-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { playlists, Prisma } from '@prisma/client';
import { PagingDto } from 'src/common/paging/paging.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PlaylistResponse } from './dto/playlist-response.dto';
import _ from 'lodash';
import { JsonArray } from '@prisma/client/runtime/library';
@Injectable()
export class PlaylistService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}
  async create({
    song_ids = [],
    ...payload
  }: CreatePlaylistDto): Promise<playlists> {
    return this.prismaService.playlists.create({
      data: {
        songs: song_ids,
        ...payload,
      },
    });
  }

  findAll({
    cursor,
    limit = 50,
    page = 1,
    user_id,
  }: PagingDto & { user_id: number }): Promise<playlists[]> {
    const options: Prisma.playlistsFindManyArgs = {
      where: {
        user_id,
      },
      take: +limit,
      skip: cursor ? 1 : (+page - 1) * +limit,
      cursor: cursor ? { id: +cursor } : undefined,
    };
    return this.prismaService.playlists.findMany(options);
  }

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
    return {
      ...playlistFound,
      song_details,
    };
  }

  async addSongToPlaylist({
    song_ids,
    id,
    user_id,
  }: {
    song_ids: number[];
    id: number;
    user_id: number;
  }): Promise<playlists> {
    const foundPlaylist = await this.prismaService.playlists.findFirst({
      where: {
        id,
      },
    });
    if (!foundPlaylist) {
      throw new RpcException({
        message: 'No playlist found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundPlaylist.user_id !== user_id) {
      throw new RpcException({
        message: 'forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    // newListStrong
    const songs = await lastValueFrom<SongDto[]>(
      this.songService.send('getListSongReturnArray', song_ids),
    );
    if (songs.length !== song_ids.length) {
      throw new RpcException({
        message: 'Lenght of songs found not equal to length of song_ids',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const oldSong: number[] = foundPlaylist.songs as number[];
    const newSong = [...oldSong, ...songs.map((e) => e.id)];

    return this.prismaService.playlists.update({
      where: { id },
      data: {
        songs: newSong,
      },
    });
  }

  async removeASongOutPlayList({
    playlist_id,
    song_id,
    user_id,
  }: {
    song_id: number;
    playlist_id: number;
    user_id: number;
  }): Promise<playlists> {
    const playlists = await this.prismaService.playlists.findFirst({
      where: {
        id: playlist_id,
      },
    });
    if (!playlists) {
      throw new RpcException({
        message: 'No playlist found ',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const songsIds = playlists.songs as number[];
    if (playlists.user_id !== user_id) {
      throw new RpcException({
        message: 'forbidden ',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    if (!songsIds.includes(song_id)) {
      throw new RpcException({
        message: 'no song in playlist ',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return this.prismaService.playlists.update({
      where: { id: playlist_id },
      data: {
        songs: songsIds.filter((s) => s !== song_id),
      },
    });
  }

  async remove(id: number, user_id: number) {
    // found a playlist
    const foundPlaylist = await this.prismaService.playlists.findFirst({
      where: { id },
    });
    if (!foundPlaylist) {
      throw new RpcException({
        message: 'No playlist found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundPlaylist.user_id !== user_id) {
      throw new RpcException({
        message: 'forbidden ',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.playlists.delete({
      where: { id },
    });
  }
}
