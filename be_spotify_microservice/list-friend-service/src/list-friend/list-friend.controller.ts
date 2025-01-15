import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ListFriendService } from './list-friend.service';
import { CreateListFriendDto } from './dto/create-list-friend.dto';
import { UpdateListFriendDto } from './dto/update-list-friend.dto';

@Controller()
export class ListFriendController {
  constructor(private readonly listFriendService: ListFriendService) {}
}
