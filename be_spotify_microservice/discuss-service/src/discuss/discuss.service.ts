import { ClientProxy, RpcException } from '@nestjs/microservices';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { SongDto } from 'src/common/dto/song.dto';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiscussService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
  ) {}
  async create({
    content,
    replay_discuss_id,
    song_id,
    user_id,
  }: CreateDiscussDto) {
    // check song
    const foundSong = await lastValueFrom<SongDto>(
      this.songService.send('findOneSong', song_id),
    );
    if (!foundSong || foundSong.status === 'Disabled') {
      throw new RpcException({
        message: 'Song not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (replay_discuss_id) {
      const foundDiscuss = await this.prismaService.discuss.findUnique({
        where: {
          id: replay_discuss_id,
        },
      });
      if (!foundDiscuss) {
        throw new RpcException({
          message: 'Discuss not found',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }
    return this.prismaService.discuss.create({
      data: {
        content,
        replay_discuss_id,
        song_id,
        user_id,
      },
    });
  }

  findListCommentBySongId(song_id: number, paging: PagingDto) {
    const { cursor, limit, page } = paging;
    const options: Prisma.DiscussFindManyArgs = {
      take: +limit,
      where: {
        song_id,
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
    return this.prismaService.discuss.findMany(options);
  }

  findOne(id: number) {
    return this.prismaService.discuss.findFirst({
      where: {
        id,
      },
    });
  }

  async update({ content, id, user_id }: UpdateDiscussDto) {
    // check exist
    const foundDiscuss = await this.prismaService.discuss.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundDiscuss) {
      throw new RpcException({
        message: 'Discuss not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundDiscuss.user_id !== user_id) {
      throw new RpcException({
        message: 'User not permission',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.discuss.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      },
    });
  }

  async remove(id: number, user_id: number) {
    // check exit
    const foundDiscuss = await this.prismaService.discuss.findFirst({
      where: {
        id,
      },
    });
    if (!foundDiscuss) {
      throw new RpcException({
        message: 'Discuss not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // check user
    if (foundDiscuss.user_id !== user_id) {
      throw new RpcException({
        message: 'User not permission',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    return this.prismaService.discuss.delete({
      where: {
        id,
      },
    });
  }
}
