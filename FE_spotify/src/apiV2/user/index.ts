import api from "@/apis/apiUtil";
import { UserResponseDto } from "@/types/ver2/auth.type";
import { PagingDto } from "@/types/ver2/paging.type";
import SuccessResponse from "@/types/ver2/response.type";
import { DetailSingerResponseDto } from "@/types/ver2/user.type";

const userApi = {
  getSinger: ({ cursor, limit, page }: PagingDto) => {
    return api.get<SuccessResponse<UserResponseDto[]>>(`/user/singer`, {
      params: {
        cursor,
        limit,
        page,
      },
    });
  },
  getSingerDetail: (id: number) => {
    return api.get<SuccessResponse<DetailSingerResponseDto>>(
      `/user/${id}/singer-detail`
    );
  },
};

export default userApi;
