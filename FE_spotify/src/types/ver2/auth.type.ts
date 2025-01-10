export type LoginRequestBody = {
  username: string;
  password: string;
};

export type UserResponseDto = {
  id: number;
  account: string;
  name: string;
  nationality: string;
  chanalName: string;
  avatar: string;
  desciption: string;
  refreshToken: string;
  password: string;
  banner: string;
  role_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  role: {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
};

export type LoginResponseType = {
  info_user: UserResponseDto;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};
