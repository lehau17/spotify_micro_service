import { Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowingService {
  constructor(private readonly prismaService: PrismaService) {}
  create({ following_user_id, user_id }: CreateFollowingDto) {
    // check;
  }

  findAll() {
    return `This action returns all following`;
  }

  findOne(id: number) {
    return `This action returns a #${id} following`;
  }

  update(id: number, updateFollowingDto: UpdateFollowingDto) {
    return `This action updates a #${id} following`;
  }

  remove(id: number) {
    return `This action removes a #${id} following`;
  }
}
