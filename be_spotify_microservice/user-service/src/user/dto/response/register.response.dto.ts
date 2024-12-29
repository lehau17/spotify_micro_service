import { users } from '@prisma/client';

export class RegisterResponseDto {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  info_user: users;
}
