import api from "@/apis/apiUtil";
import { PagingDto } from "@/types/ver2/paging.type";
import { RecentSongResponse } from "@/types/ver2/recent-song.type";
import SuccessResponse from "@/types/ver2/response.type";

const recentSongApi = {
  getRecentSongOfme: ({ cursor, limit, page }: PagingDto) => {
    return api.get<SuccessResponse<RecentSongResponse[]>>(`recent-song/me`, {
      params: {
        cursor,
        limit,
        page,
      },
    });
  },
};

export default recentSongApi;
