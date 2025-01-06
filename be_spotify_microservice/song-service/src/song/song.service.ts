import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GenreDto } from 'src/common/dto/gerne.dto';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Prisma, Song, Status } from '@prisma/client';
import { CacheService } from 'src/cache/cache.service';
import Redis from 'ioredis';

@Injectable()
export class SongService {
  private redis: Redis;
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    @Inject('GERNE_SERVICE') private readonly genreService: ClientProxy,
  ) {
    this.redis = CacheService.getClient();
    this.logger = new Logger(SongService.name);
  }
  async create(createSongDto: CreateSongDto) {
    //check gerne
    const genre = await lastValueFrom<GenreDto>(
      this.genreService.send('findOneGenre', createSongDto.genre_id).pipe(),
    );
    if (!genre || genre.status === 'Disable') {
      throw new RpcException({
        message: 'Genre not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.song.create({
      data: {
        ...createSongDto,
      },
    });
  }

  async getListSong(ids: number[]) {
    // get database
    return this.prismaService.song.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async checkSongsExist(songIds: number[]): Promise<boolean> {
    const listSongs = await this.prismaService.song.findMany({
      where: {
        id: {
          in: songIds,
        },
        status: 'Enable',
      },
    });
    return listSongs.length === songIds.length;
  }

  async deXuatBaiHat({ cursor, limit, page }: PagingDto): Promise<Song[]> {
    // check redis
    const key = `deXuat:${cursor ? cursor : page}`;
    const foundInRedis = await this.redis.get(key);
    if (foundInRedis && foundInRedis.length >= 1) {
      this.logger.debug(`Found in redis`);
      return JSON.parse(foundInRedis) as Song[];
    }

    //
    const options: Prisma.SongFindManyArgs = {
      take: +limit,
    };
    if (cursor) {
      options.cursor = {
        id: +cursor,
      };
      options.skip = 1;
    } else {
      options.skip = (+page - 1) * +limit;
    }
    const listSong = await this.prismaService.song.findMany(options);
    const isOk = await this.redis.setex(key, 30, JSON.stringify(listSong));
    if (!isOk) {
      this.logger.error('chet redis in song service');
    }
    return listSong;
  }

  async listMySong(paging: PagingDto & { user_id: number }): Promise<Song[]> {
    const { cursor, limit, page, user_id } = paging;
    const key = `mysong:${cursor ? cursor : page}:${user_id}`;
    const foundInRedis = await this.redis.get(key);
    if (foundInRedis && foundInRedis.length >= 0) {
      this.logger.debug(`Found in redis`);
      return JSON.parse(foundInRedis) as Song[];
    }
    const options: Prisma.SongFindManyArgs = {
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
      options.skip = (+page - 1) * +limit;
    }
    const listMySong = await this.prismaService.song.findMany(options);
    const isOk = await this.redis.setex(key, 30, JSON.stringify(listMySong));
    if (!isOk) {
      this.logger.error('chet redis in song service');
    }
    return listMySong;
  }

  findAll() {
    return `This action returns all song`;
  }

  async findOne(id: number): Promise<Song> {
    // check redis
    const key = `song:${id}`;
    const foundSongRedis = await this.redis.get(key);
    if (foundSongRedis && foundSongRedis.length > 0) {
      return JSON.parse(foundSongRedis) as Song;
    }
    // get database
    const foundSong = await this.prismaService.song.findFirst({
      where: { id, status: Status.Enable },
    });
    if (foundSong) {
      await this.redis.setex(key, 30, JSON.stringify(foundSong));
    }
    return foundSong;
  }

  async update({ id, user_id, ...payload }: UpdateSongDto): Promise<Song> {
    // check find song
    const foundSong = await this.findOne(id);
    if (!foundSong || foundSong.status === Status.Disable) {
      throw new RpcException({
        message: 'Song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundSong.user_id !== user_id) {
      throw new RpcException({
        message: 'You are not owner of this song',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.song.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }

  async remove(id: number, user_id: number) {
    // check song
    const foundSong = await this.prismaService.song.findUnique({
      where: {
        id,
      },
    });
    if (!foundSong || foundSong.status === Status.Disable) {
      throw new RpcException({
        message: 'Song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundSong.user_id !== user_id) {
      throw new RpcException({
        message: 'You are not owner of this song',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.song.update({
      where: {
        id,
      },
      data: {
        status: Status.Disable,
      },
    });
  }
}
