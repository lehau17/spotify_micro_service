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
  create(createDiscussDto: CreateDiscussDto) {
    return lastValueFrom(
      this.discussService
        .send('createDiscuss', createDiscussDto)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all discuss`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discuss`;
  }

  update(id: number, updateDiscussDto: UpdateDiscussDto) {
    return `This action updates a #${id} discuss`;
  }

  remove(id: number) {
    return `This action removes a #${id} discuss`;
  }
}
