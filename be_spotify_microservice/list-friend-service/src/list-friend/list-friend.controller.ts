import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ListFriendService } from './list-friend.service';
import { CreateListFriendDto } from './dto/create-list-friend.dto';
import { UpdateListFriendDto } from './dto/update-list-friend.dto';
import { Status } from '@prisma/client';
import { PagingDto } from './dto/paging.dto';

@Controller()
export class ListFriendController {
  constructor(private readonly listFriendService: ListFriendService) {}

  @MessagePattern('send-request')
  sendFriendRequest(@Payload() payload: CreateListFriendDto) {
    return this.listFriendService.sendFriendRequest(payload);
  }

  @MessagePattern('acceptFriendShip')
  acceptFriendShip(
    @Payload() payload: { id: number; receive_user_id: number },
  ) {
    return this.listFriendService.acceptFriendShip(payload);
  }

  @MessagePattern('deniedFriendShip')
  deniedFriendShip(
    @Payload() payload: { id: number; receive_user_id: number },
  ) {
    return this.listFriendService.deniedFriendShip(payload);
  }

  @MessagePattern('disableFriendShip')
  disableFriendShip(@Payload() payload: number) {
    return this.listFriendService.disableFriendShip(payload);
  }

  @MessagePattern('deleteSendFriendShip')
  deleteSendFriendShip(
    @Payload() payload: { id: number; send_user_id: number },
  ) {
    return this.listFriendService.deleteSendFriendShip(payload);
  }

  @MessagePattern('changeStatus')
  changeStatus(@Payload() { id, status }: { id: number; status: Status }) {
    return this.listFriendService.changeStatus(id, status);
  }

  @MessagePattern('checkFriendShip')
  checkFriendShip(
    @Payload() { user_id, friend_id }: { user_id: number; friend_id: number },
  ) {
    return this.listFriendService.checkFriendShip(user_id, friend_id);
  }

  @MessagePattern('listFriend')
  listFriend(
    @Payload() { user_id, ...paging }: PagingDto & { user_id: number },
  ) {
    return this.listFriendService.listFriend(user_id, paging);
  }

  @MessagePattern('findOne')
  findOne(@Payload() payload: number) {
    return this.listFriendService.findOne(payload);
  }
}
