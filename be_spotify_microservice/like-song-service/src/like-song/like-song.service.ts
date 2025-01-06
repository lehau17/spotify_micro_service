import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikedSong, Prisma } from '@prisma/client';
import { last, lastValueFrom } from 'rxjs';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class LikeSongService {
  constructor(
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}
  async create({ song_id, user }: CreateLikeSongDto): Promise<LikedSong> {
    // check song exists
    const foundSong = await lastValueFrom(
      this.songService.send('findOneSong', song_id),
    );
    if (!foundSong) {
      throw new RpcException({
        message: 'Not Found Song',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.likedSong.create({
      data: {
        song_id: song_id,
        user,
      },
    });
  }

  findAll({
    cursor,
    limit = 50,
    page = 1,
    song_id,
  }: PagingDto & { song_id: number }): Promise<LikedSong[]> {
    const options: Prisma.LikedSongFindManyArgs = {
      where: {
        song_id,
      },
      take: +limit,
      skip: cursor ? 1 : (+page - 1) * limit,
      cursor: {
        id: cursor ? cursor : undefined,
      },
    };
    return this.prismaService.likedSong.findMany(options);
  }

  findOne(id: number) {
    return this.prismaService.likedSong.findFirst({
      where: {
        id,
      },
    });
  }

  async remove({
    id,
    user_id,
  }: {
    id: number;
    user_id: number;
  }): Promise<LikedSong> {
    //find
    const foundLikeSong = await this.findOne(id);
    if (!foundLikeSong)
      throw new RpcException({
        message: 'song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    console.log('check type', foundLikeSong.user);
    if (foundLikeSong.user !== user_id) {
      throw new RpcException({
        message: 'forbidden',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.likedSong.delete({
      where: {
        id,
      },
    });
  }
}
