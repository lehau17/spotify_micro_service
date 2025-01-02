import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GenreDto } from 'src/common/dto/gerne.dto';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Prisma, Song, Status } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GERNE_SERVICE') private readonly genreService: ClientProxy,
  ) {}
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

  deXuatBaiHat({ cursor, limit, page }: PagingDto) {
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
    return this.prismaService.song.findMany(options);
  }

  listMySong(paging: PagingDto & { user_id: number }) {
    const { cursor, limit, page, user_id } = paging;
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
    return this.prismaService.song.findMany(options);
  }

  findAll() {
    return `This action returns all song`;
  }

  findOne(id: number) {
    return this.prismaService.song.findFirst({
      where: { id, status: Status.Enable },
    });
  }

  async update({ id, user_id, ...payload }: UpdateSongDto): Promise<Song> {
    // check find song
    const foundSong = await this.prismaService.song.findFirst({
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
