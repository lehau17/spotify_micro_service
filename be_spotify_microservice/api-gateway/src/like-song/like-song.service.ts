import { Inject, Injectable } from '@nestjs/common';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LikeSongService {
  constructor(
    @Inject('LIKESONG_SERVICE') private readonly likeSongService: ClientProxy,
  ) {}
  create(
    createLikeSongDto: CreateLikeSongDto,
    user: { id: number; name: string; url: string },
  ) {
    return lastValueFrom(
      this.likeSongService.send('createLikeSong', {
        ...createLikeSongDto,
        user,
      }),
    );
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
