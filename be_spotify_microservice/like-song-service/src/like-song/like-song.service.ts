import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikedSong, Prisma } from '@prisma/client';
import { last, lastValueFrom } from 'rxjs';
import { PagingDto } from 'src/common/paging/paging.dto';
import Redis from 'ioredis';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class LikeSongService {
  private redis: Redis;
  constructor(
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {
    this.redis = CacheService.getClient();
  }
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

  async findAll({
    cursor,
    limit = 50,
    page = 1,
    song_id,
  }: PagingDto & { song_id: number }): Promise<LikedSong[]> {
    const key = `like:${cursor ? cursor : page}:${song_id}`;
    //chec redis
    const foundValueInRedis = await this.redis.get(key);
    if (foundValueInRedis && foundValueInRedis.length > 0) {
      return JSON.parse(foundValueInRedis) as LikedSong[];
    }
    const options: Prisma.LikedSongFindManyArgs = {
      where: {
        song_id,
      },
      take: +limit,
      skip: cursor ? 1 : (+page - 1) * limit,
      cursor: cursor
        ? {
            id: cursor ? cursor : undefined,
          }
        : undefined,
    };
    const foundListLikedSong =
      await this.prismaService.likedSong.findMany(options);
    if (foundListLikedSong && foundListLikedSong.length > 0) {
      await this.redis.setex(key, 30, JSON.stringify(foundListLikedSong));
    }
    return foundListLikedSong;
  }

  async findOne(id: number): Promise<LikedSong> {
    // check redis
    const key = `likedSong:${id}`;
    const foundInCache = await this.redis.get(key);
    if (foundInCache) {
      return JSON.parse(foundInCache) as LikedSong;
    }
    //
    const foundLiked = await this.prismaService.likedSong.findFirst({
      where: {
        id,
      },
    });
    if (foundLiked) {
      await this.redis.setex(key, 30, JSON.stringify(foundLiked));
    }
    return foundLiked;
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
