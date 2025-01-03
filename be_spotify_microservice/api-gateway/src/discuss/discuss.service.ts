import { Inject, Injectable } from '@nestjs/common';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

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

  findAll() {
    return `This action returns all discuss`;
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
