import songApi from "@/apiV2/song";
import userApi from "@/apiV2/user";
import { PagingDto } from "@/types/ver2/paging.type";
import { useQuery } from "@tanstack/react-query";

export const useGetSongPopularQuery = ({ cursor, limit, page }: PagingDto) => {
  return useQuery({
    queryKey: ["get popular song", cursor, limit, page],
    queryFn: () => songApi.getRecentSongOfme({ cursor, limit, page }),
  });
};

export const useGetSingerDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ["getsingerDetail", id],
    queryFn: () => userApi.getSingerDetail(id),
  });
};
