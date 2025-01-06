export class RegisterResponseDto {
  info_user: {
    id: number;
    account: string;
    name: string;
    nationality: any;
    chanalName: any;
    avatar: any;
    desciption: any;
    refreshToken: any;
    password: string;
    banner: any;
    role_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
