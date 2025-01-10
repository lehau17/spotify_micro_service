import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateRecentSongDto } from './dto/update-recent-song.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { last, lastValueFrom } from 'rxjs';
import { SongDto } from 'src/common/dto/song/song.dto';
import { CreateRecentSongDto } from './dto/create-recent-song.dto';
import { Prisma, RecentSong } from '@prisma/client';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class RecentSongService {
  constructor(
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}
  async create(create: CreateRecentSongDto) {
    // check song
    const foundSong = await lastValueFrom<SongDto>(
      this.songService.send('findOneSong', create.song_id),
    );
    if (!foundSong || foundSong.status === 'Disable') {
      throw new RpcException({
        message: 'Song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.recentSong.upsert({
      where: {
        user_id: create.user_id,
        song_id: create.song_id,
      },
      update: {
        time: create.time,
      },
      create: {
        ...create,
      },
    });
  }

  async findAll({
    cursor,
    limit,
    page,
    user_id,
  }: PagingDto & { user_id: number }): Promise<
    {
      id: number;
      user_id: number;
      song_id: number;
      time: string;
      created_at: Date;
      updated_at: Date;
      song: SongDto;
    }[]
  > {
    const options: Prisma.RecentSongFindManyArgs = {
      take: +limit,
      where: {
        user_id: +user_id,
      },
    };
    if (cursor) {
      options.cursor = {
        id: +cursor,
      };
      options.skip = 1;
    } else {
      options.skip = (+page - 1) * limit;
    }
    const recentSongs = await this.prismaService.recentSong.findMany(options);
    const songIds = recentSongs.map((recentSong) => recentSong.song_id);
    const songs = await lastValueFrom<Record<number, SongDto>>(
      this.songService.send('getListSong', songIds),
    );
    // get song data
    return recentSongs.map((song) => {
      return { ...song, song: songs[song.song_id] };
    });
  }

  findOne(id: number): Promise<RecentSong | null> {
    return this.prismaService.recentSong.findFirst({
      where: {
        id,
      },
    });
  }

  async update({ id, time }: UpdateRecentSongDto) {
    const foundSong = await this.findOne(id);
    if (!foundSong) {
      throw new RpcException({
        message: 'Recent song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.recentSong.update({
      where: {
        id,
      },
      data: {
        time,
      },
    });
  }

  async remove(id: number, user_id: number): Promise<RecentSong> {
    // found song
    const foundSong = await this.findOne(id);
    if (!foundSong) {
      throw new RpcException({
        message: 'Recent song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundSong.user_id !== user_id) {
      throw new RpcException({
        message: 'You are not authorized to delete this song',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.recentSong.delete({
      where: {
        id,
      },
    });
  }
}
