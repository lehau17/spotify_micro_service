import { PartialType } from '@nestjs/mapped-types';
import { CreateListFriendDto } from './create-list-friend.dto';

export class UpdateListFriendDto extends PartialType(CreateListFriendDto) {
  id: number;
}
