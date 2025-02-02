import api from "@/apis/apiUtil";
import { PagingDto } from "@/types/ver2/paging.type";
import {
  CreatePlaylistDto,
  PlayListDetailDto,
  PlayListDto,
} from "@/types/ver2/playlist.type";
import SuccessResponse from "@/types/ver2/response.type";

const playListApi = {
  getMe: (payload: PagingDto) => {
    return api.get<SuccessResponse<PlayListDto[]>>(`/playlist/me`, {
      params: { ...payload },
    });
  },
  createPlaylist: (payload: CreatePlaylistDto) => {
    return api.post<SuccessResponse<PlayListDto>>("playlist", payload);
  },
  getDetail: (id: number) => {
    return api.get<SuccessResponse<PlayListDetailDto>>(`playlist/${id}`);
  },
  addSongToPlaylist: ({
    songIds,
    playListId,
  }: {
    songIds: number[];
    playListId: number;
  }) => {
    return api.patch<SuccessResponse<PlayListDto>>(
      `playlist/${playListId}/add-songs`,
      { song_ids: songIds }
    );
  },
};

export default playListApi;
