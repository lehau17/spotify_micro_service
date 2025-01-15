import { ListFriends } from '@prisma/client';

export type ListFriendResponseDto = ListFriends & {
  total_view: number;
};
