import searchApi from "@/apiV2/search";
import { PagingDto } from "@/types/ver2/paging.type";
import { useQuery } from "@tanstack/react-query";

export const useSearchSongQuery = (
  paging: PagingDto & {
    text?: string;
  }
) => {
  return useQuery({
    queryKey: ["searchSong", paging],
    queryFn: () => searchApi.searchSong(paging),
    enabled: false,
  });
};
