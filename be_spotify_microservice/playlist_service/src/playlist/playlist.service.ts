import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { playlists, Prisma } from '@prisma/client';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createPlaylistDto: CreatePlaylistDto): Promise<playlists> {
    return this.prismaService.playlists.create({
      data: {
        ...createPlaylistDto,
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
      take: limit,
      skip: cursor ? 1 : (+page - 1) * +limit,
      cursor: cursor ? { id: +cursor } : undefined,
    };
    return this.prismaService.playlists.findMany(options);
  }

  async findOne(id: number): Promise<playlists> {
    const playlistFound = await this.prismaService.playlists.findUnique({
      where: {
        id,
      },
    });
    // call service playlistsong
    return playlistFound;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
