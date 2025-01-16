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

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: playListApi.createPlaylist,
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
