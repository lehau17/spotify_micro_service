import { Inject, Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-folowing.dto';
import { UpdateFolowingDto } from './dto/update-folowing.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/paging/paging.dto';
@Injectable()
export class FolowingService {
  constructor(
    @Inject('FOLLOWING_SERVICE') private readonly followService: ClientProxy,
  ) {}
  create(createFolowingDto: CreateFollowingDto, user_id: number) {
    return lastValueFrom(
      this.followService
        .send('createFollowing', {
          ...createFolowingDto,
          user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll(paging: PagingDto, user_id: number) {
    return lastValueFrom(
      this.followService
        .send('findAllFollowing', {
          ...paging,
          user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findOne(id: number) {
    return lastValueFrom(
      this.followService
        .send('findOneFollowing', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateFolowingDto: UpdateFolowingDto) {
    return lastValueFrom(
      this.followService
        .send('removeFollowing', { id, updateFolowingDto })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  remove(id: number, user_id: number) {
    return lastValueFrom(
      this.followService
        .send('removeFollowing', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  toggerFollower(user_id: number, following_user_id: number) {
    return lastValueFrom(
      this.followService
        .send('toggerFollower', { following_user_id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
