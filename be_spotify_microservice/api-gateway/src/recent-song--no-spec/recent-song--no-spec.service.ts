import { Injectable } from '@nestjs/common';
import { CreateRecentSongNoSpecDto } from './dto/create-recent-song--no-spec.dto';
import { UpdateRecentSongNoSpecDto } from './dto/update-recent-song--no-spec.dto';

@Injectable()
export class RecentSongNoSpecService {
  create(createRecentSongNoSpecDto: CreateRecentSongNoSpecDto) {
    return 'This action adds a new recentSongNoSpec';
  }

  findAll() {
    return `This action returns all recentSongNoSpec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recentSongNoSpec`;
  }

  update(id: number, updateRecentSongNoSpecDto: UpdateRecentSongNoSpecDto) {
    return `This action updates a #${id} recentSongNoSpec`;
  }

  remove(id: number) {
    return `This action removes a #${id} recentSongNoSpec`;
  }
}
