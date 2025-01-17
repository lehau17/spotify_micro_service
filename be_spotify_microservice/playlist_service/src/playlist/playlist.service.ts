import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePlaylistDto, SongDto } from './dto/create-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { playlists, Prisma } from '@prisma/client';
import { PagingDto } from 'src/common/paging/paging.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PlaylistResponse } from './dto/playlist-response.dto';
import _ from 'lodash';
@Injectable()
export class PlaylistService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}
  async create({
    song_ids,
    ...payload
  }: CreatePlaylistDto): Promise<playlists> {
    const songs = await lastValueFrom<SongDto[]>(
      this.songService.send('getListSong', song_ids),
    );
    if (songs.length !== song_ids.length) {
      throw new RpcException({
        message: 'bad request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.playlists.create({
      data: {
        songs: songs,
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

  async findOne(id: number): Promise<PlaylistResponse> {
    console.log('check id: ' + id);
    const playlistFound = await this.prismaService.playlists.findUnique({
      where: {
        id,
      },
    });

    let dataResponse: PlaylistResponse;
    const songIds = playlistFound.songs as number[];

    // call service playlistsong
    if (songIds.length > 0) {
      const listSong = await lastValueFrom<Record<number, SongDto>>(
        this.songService.send('getListSong', songIds),
      );
      delete playlistFound.songs;
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
        message: 'forbidden ',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    // newListStrong
    const songs = await lastValueFrom<SongDto[]>(
      this.songService.send('getListSong', song_ids),
    );
    if (songs.length !== song_ids.length) {
      throw new RpcException({
        message: 'bad request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const oldSong: SongDto[] = JSON.parse(foundPlaylist.songs as string);
    const newSong = [...oldSong, ...songs];

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
        songs: {
          path: ['$[*].id'],
          equals: song_id, // Số cần tìm
        },
      },
    });
    if (!playlists) {
      throw new RpcException({
        message: 'No playlist',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (playlists.user_id !== user_id) {
      throw new RpcException({
        message: 'forbidden ',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    // remove song
    const oldSong: SongDto[] = JSON.parse(playlists.songs as string);
    const newSong = oldSong.filter((song) => song.id !== song_id);

    return this.prismaService.playlists.update({
      where: { id: playlist_id },
      data: {
        songs: newSong,
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
