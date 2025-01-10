export type ToggeFollowingDto = {
  following_user_id: number;
};

export type FollowingDto = {
  id: number;
  user_id: number | null;
  following_user_id: number | null;
  status: string;
  created_at: Date;
};
