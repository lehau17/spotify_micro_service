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
import { Cron } from '@nestjs/schedule';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SongService {
  private redis: Redis;
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GERNE_SERVICE') private readonly genreService: ClientProxy,
  ) {
    this.redis = CacheService.getClient();
    this.logger = new Logger(SongService.name);
  }

  /**
   * @description increase view in redis cache
   * @param createSongDto
   * @task CRONJOB
   */
  @Cron('*/10 * * * * *') // Every 10 seconds
  async increaseViewCRON() {
    this.logger.debug('Processing views from Redis 10 secend');
    const batchSize = 1000;
    let cursor = '0';

    do {
      // SCAN keys with a pattern
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        'view:*',
        'COUNT',
        batchSize,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        this.logger.debug(`Processing ${keys.length} keys...`);

        // Fetch values for the keys
        const values = await this.redis.mget(keys);

        // Prepare data for database updates
        const updates = keys.map((key, index) => ({
          id: key.split(':')[1], // Extract the ID from the key
          view: parseInt(values[index], 10),
        }));

        // Update the database
        for (const update of updates) {
          if (update.view) {
            await this.prismaService.song.update({
              where: { id: +update.id },
              data: { viewer: { increment: update.view } },
            });
          }
        }

        // Remove processed keys from Redis
        await this.redis.del(...keys);
      } else {
        this.logger.debug('No view selected');
      }
    } while (cursor !== '0');

    this.logger.debug('Finished processing views from Redis');
  }

  /**
   * @description chuyển trạng thái của song thành phổ biến
   * @script SQL
   */
  @Cron('*/10 * * * * *') // Every 10 seconds
  async changePopularSong() {
    await this.prismaService.$executeRaw`WITH top_songs AS (
                SELECT id
                FROM "Song"
                WHERE viewer != 0
                ORDER BY viewer DESC
                LIMIT 100
              )
              UPDATE "Song"
              SET popular = TRUE
              WHERE id IN (SELECT id FROM top_songs);`;

    this.logger.debug('Finished processing popular from Redis');
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

  async increaseViewInRedis(id: number): Promise<void> {
    const key = `view:${id}`;
    // INCR will create the key with a value of 1 if it does not already exist
    const value = await this.redis.get(key);
    if (!value || value.length === 0) {
      await this.redis.setex(key, 12, 1);
    }
    await this.redis.incr(key);
  }

  async getListSong(ids: number[]): Promise<Record<number, Song>> {
    // get database
    const foundSongs = await this.prismaService.song.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    let result: Record<number, Song> = {};
    foundSongs.forEach((s) => {
      result[Number(s.id)] = s;
    });
    return result;
  }

  async getListSongReturnArray(ids: number[]): Promise<Song[]> {
    // get database
    const foundSongs = await this.prismaService.song.findMany({
      where: {
        id: {
          in: ids,
        },
        status: 'Enable',
      },
    });

    const genreIds = foundSongs.map((song) => {
      return song.genre_id;
    });

    // get genre

    return foundSongs;
  }

  async listSongByUser(id: number): Promise<Song[]> {
    const options: Prisma.SongFindManyArgs = {
      where: {
        status: 'Enable',
        user_id: id,
      },
      orderBy: [{ viewer: 'desc' }],
    };
    return this.prismaService.song.findMany(options);
  }

  async listPopularSong({
    cursor,
    limit = 60,
    page = 1,
  }: PagingDto): Promise<Song[]> {
    // check redis
    const key = `popularSong:${page}:${cursor}`;
    const listSongRedis = await this.redis.get(key);
    if (listSongRedis && listSongRedis.length > 0) {
      return JSON.parse(listSongRedis) as Song[];
    }
    //
    const options: Prisma.SongFindManyArgs = {
      where: {
        popular: true,
        status: 'Enable',
      },
      orderBy: [{ created_at: 'desc' }, { viewer: 'desc' }],
      take: +limit,
      skip: cursor ? 1 : (+page - 1) * limit,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    };

    const result = await this.prismaService.song.findMany(options);

    // set cache
    await this.redis.setex(key, 30, JSON.stringify(result));
    //
    return result;
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

  /**
   * GET SONG BY GERNE
   */
  async getSongByGenreId(
    id: number,
    { cursor = null, limit = 60, page = 1 }: PagingDto,
  ): Promise<Song[]> {
    const options: Prisma.SongFindManyArgs = {
      take: +limit,
      skip: cursor ? 1 : (+page - 1) * limit,
      cursor: cursor
        ? {
            id: +cursor,
          }
        : undefined,
      where: {
        status: 'Enable',
        genre_id: id,
      },
    };
    return this.prismaService.song.findMany(options);
  }
}
