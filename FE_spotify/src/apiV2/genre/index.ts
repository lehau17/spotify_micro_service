import api from "@/apis/apiUtil";
import { GenreDto } from "@/types/ver2/genre.type";
import { PagingDto } from "@/types/ver2/paging.type";
import SuccessResponse from "@/types/ver2/response.type";

const genreApi = {
  getGenre: (paging: PagingDto) => {
    return api.get<SuccessResponse<GenreDto[]>>("gerne", {
      params: {
        ...paging,
      },
    });
  },
};

export default genreApi;
