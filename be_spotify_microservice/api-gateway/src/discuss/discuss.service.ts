import { Inject, Injectable } from '@nestjs/common';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class DiscussService {
  constructor(
    @Inject('DISCUSS_SERVICE') private readonly discussService: ClientProxy,
  ) {}
  create(createDiscussDto: CreateDiscussDto, user_id: number) {
    return lastValueFrom(
      this.discussService
        .send('createDiscuss', { ...createDiscussDto, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findListDiscussBySong(paging: PagingDto, song_id: number) {
    console.log('paging', paging, song_id);
    return lastValueFrom(
      this.discussService
        .send('findListDiscussBySong', { ...paging, song_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.discussService
        .send('findOneDiscuss', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateDiscussDto: UpdateDiscussDto, user_id: number) {
    return lastValueFrom(
      this.discussService
        .send('updateDiscuss', { ...updateDiscussDto, id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.discussService
        .send('removeDiscuss', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
