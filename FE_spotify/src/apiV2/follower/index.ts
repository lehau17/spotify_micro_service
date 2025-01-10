import api from "@/apis/apiUtil";
import { UserResponseDto } from "@/types/ver2/auth.type";
import { FollowingDto, ToggeFollowingDto } from "@/types/ver2/follow.type";
import SuccessResponse from "@/types/ver2/response.type";

const followerApi = {
  togger: (payload: ToggeFollowingDto) => {
    return api.post<SuccessResponse<FollowingDto>>(
      `/following/toggle`,
      payload
    );
  },
};

export default followerApi;
