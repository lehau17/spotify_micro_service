import { Inject, Injectable } from '@nestjs/common';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

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
      this.likeSongService
        .send('createLikeSong', {
          ...createLikeSongDto,
          user,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all likeSong`;
  }

  findOne(id: number) {
    return lastValueFrom(
      this.likeSongService
        .send('createLikeSong', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateLikeSongDto: UpdateLikeSongDto) {
    return `This action updates a #${id} likeSong`;
  }

  remove(body: { id: number; user_id: number }) {
    return lastValueFrom(
      this.likeSongService
        .send('removeLikeSong', body)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
