import api from "@/apis/apiUtil";
import { PagingDto } from "@/types/ver2/paging.type";
import SuccessResponse from "@/types/ver2/response.type";
import { SongDto } from "@/types/ver2/song.response";

const songApi = {
  getRecentSongOfme: ({ cursor, limit, page }: PagingDto) => {
    return api.get<SuccessResponse<SongDto[]>>(`song/popular-song`, {
      params: {
        cursor,
        limit,
        page,
      },
    });
  },
  getSong: (id: number) => {
    return api.get<SuccessResponse<SongDto>>(`song/${id}`);
  },

  increaseSong: (id: number) => {
    return api.patch(`song/${id}/inc-view`);
  },
};

export default songApi;
