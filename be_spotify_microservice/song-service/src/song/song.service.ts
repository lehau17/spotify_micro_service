import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GenreDto } from 'src/common/dto/gerne.dto';

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

  findAll() {
    return `This action returns all song`;
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
