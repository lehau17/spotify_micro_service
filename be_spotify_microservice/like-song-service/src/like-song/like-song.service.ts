import { Injectable } from '@nestjs/common';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';

@Injectable()
export class LikeSongService {
  create(createLikeSongDto: CreateLikeSongDto) {
    return 'This action adds a new likeSong';
  }

  findAll() {
    return `This action returns all likeSong`;
  }

  findOne(id: number) {
    return `This action returns a #${id} likeSong`;
  }

  update(id: number, updateLikeSongDto: UpdateLikeSongDto) {
    return `This action updates a #${id} likeSong`;
  }

  remove(id: number) {
    return `This action removes a #${id} likeSong`;
  }
}
