import api from "@/apis/apiUtil";
import { PagingDto } from "@/types/ver2/paging.type";
import SuccessResponse from "@/types/ver2/response.type";
import { SongDto } from "@/types/ver2/song.response";

const searchApi = {
  searchSong: (paging: PagingDto & { text?: string }) => {
    return api.get<SuccessResponse<SongDto[]>>(`search/song`, {
      params: {
        ...paging,
      },
    });
  },
};

export default searchApi;
