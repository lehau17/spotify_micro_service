import recentSongApi from "@/apiV2/recent_song";
import { PagingDto } from "@/types/ver2/paging.type";
import { useQuery } from "@tanstack/react-query";

export const useGetRecentSongQuery = ({ cursor, limit, page }: PagingDto) => {
  return useQuery({
    queryKey: ["get recent song", cursor, limit, page],
    queryFn: () => recentSongApi.getRecentSongOfme({ cursor, limit, page }),
  });
};
