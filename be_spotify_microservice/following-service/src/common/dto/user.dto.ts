import { Status } from '@prisma/client';

export class UserDto {
  id: number;
  status: Status;
}
