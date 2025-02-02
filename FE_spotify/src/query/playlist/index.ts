import { addSongToPlaylist } from "./../../apis/apiPlayList/apiAddSongToPlaylist";
import playListApi from "@/apiV2/playlist";
import { PagingDto } from "@/types/ver2/paging.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetPlayListOfMeQuery = ({
  cursor,
  limit = 50,
  page = 50,
}: PagingDto) => {
  return useQuery({
    queryKey: ["get-playlist-of-me", cursor, limit, page],
    queryFn: () => playListApi.getMe({ cursor, limit, page }),
  });
};

export const useCreatePlaylistMutation = () => {
  return useMutation({
    mutationFn: playListApi.createPlaylist,
    onError: (err) => {
      toast.error(err.message);
    },
  });
};

export const useGetDetailPlaylistQuery = (id: number) => {
  return useQuery({
    queryKey: ["get-playlist-of", id],
    queryFn: () => playListApi.getDetail(id),
  });
};

export const useAddSongToPlayListMutation = () => {
  return useMutation({
    mutationFn: playListApi.addSongToPlaylist,
  });
};
