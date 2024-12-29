import { users } from '@prisma/client';

export class LoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  info_user: users;
}
