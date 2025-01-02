import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GerneService {
  constructor(private readonly prismaService: PrismaService) {}
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
      take: limit,
    };
    if (cursor) {
      options.cursor = {
        id: cursor,
      };
      options.skip = 1;
    } else {
      options.skip = (page - 1) * limit;
    }
    return this.prismaService.genre.findMany(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} gerne`;
  }

  update(id: number, updateGerneDto: UpdateGerneDto) {
    return `This action updates a #${id} gerne`;
  }

  remove(id: number) {
    return `This action removes a #${id} gerne`;
  }
}
