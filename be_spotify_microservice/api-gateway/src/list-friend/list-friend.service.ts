import { Inject, Injectable } from '@nestjs/common';
import { CreateListFriendDto } from './dto/create-list-friend.dto';
import { UpdateListFriendDto } from './dto/update-list-friend.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PagingDto } from 'src/common/paging/paging.dto';

@Injectable()
export class ListFriendService {
  constructor(
    @Inject('LISTFRIEND_SERVICE')
    private readonly listFriendService: ClientProxy,
  ) {}
  sendFriendRequest(createListFriendDto: CreateListFriendDto, user_id: number) {
    return lastValueFrom(
      this.listFriendService
        .send('send-request', {
          ...createListFriendDto,
          user_id,
        })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  deniedFriendShip(id: number, receive_user_id: number) {
    return lastValueFrom(
      this.listFriendService
        .send('deniedFriendShip', { id, receive_user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  acceptRequest(id: number, receive_user_id: number) {
    return lastValueFrom(
      this.listFriendService
        .send('acceptFriendShip', { id, receive_user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all listFriend`;
  }

  findOne(id: number) {
    return lastValueFrom(
      this.listFriendService
        .send('findOne', id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  update(id: number, updateListFriendDto: UpdateListFriendDto) {
    return `This action updates a #${id} listFriend`;
  }

  remove(id: number, send_user_id: number) {
    return lastValueFrom(
      this.listFriendService
        .send('deleteSendFriendShip', { id, send_user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  changeStatus(id: number, body: ChangeStatusDto) {
    return lastValueFrom(
      this.listFriendService
        .send('changeStatus', { id, ...body })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  listFriend(user_id: number, paging: PagingDto) {
    return lastValueFrom(
      this.listFriendService
        .send('listFriend', { user_id, ...paging })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
