import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Genre, Prisma, Status } from '@prisma/client';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GerneService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}
  async create({ nameGenre }: CreateGerneDto) {
    //check unique
    const foundGerne = await this.prismaService.genre.findFirst({
      where: {
        nameGenre: nameGenre,
      },
    });
    if (foundGerne) {
      throw new RpcException({
        message: 'Gerne already exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // create gerne
    return this.prismaService.genre.create({
      data: {
        nameGenre,
      },
    });
  }

  findAll({ cursor, limit, page }: PagingDto) {
    const options: Prisma.GenreFindManyArgs = {
      take: +limit,
      where: {
        status: Status.Enable,
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
    return this.prismaService.genre.findMany(options);
  }

  findOne(id: number) {
    return this.prismaService.genre.findFirst({
      where: {
        id,
      },
    });
  }

  async findOneWithSongs(id: number) {
    const foundGenre = await this.findOne(id);
    if (!foundGenre || foundGenre.status !== 'Enable') {
      throw new RpcException({
        message: 'Not found Genre',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const listSong = await lastValueFrom(
      this.songService.send('getSongByGenreId', { id }),
    );
    return {
      ...foundGenre,
      songs: listSong,
    };
  }

  async findByids(ids: number[]): Promise<Record<number, Genre>> {
    const listGenre = await this.prismaService.genre.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    let recordGenrn: Record<number, Genre>;
    listGenre.forEach((e) => {
      recordGenrn[e.id] = e;
    });
    return recordGenrn;
  }

  async update({ id, nameGenre }: UpdateGerneDto) {
    const foundGerne = await this.prismaService.genre.findFirst({
      where: { id: id },
    });
    if (!foundGerne || foundGerne.status === Status.Disable) {
      throw new RpcException({
        message: 'Gerne not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return this.prismaService.genre.update({
      where: {
        id: id,
      },
      data: {
        nameGenre,
      },
    });
  }

  async remove(id: number) {
    const foundGerne = await this.prismaService.genre.findFirst({
      where: { id: id },
    });
    if (!foundGerne || foundGerne.status === Status.Disable) {
      throw new RpcException({
        message: 'Gerne not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return this.prismaService.genre.update({
      where: {
        id: id,
      },
      data: {
        status: Status.Disable,
      },
    });
  }
}
