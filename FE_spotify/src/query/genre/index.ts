import genreApi from "@/apiV2/genre";
import { PagingDto } from "@/types/ver2/paging.type";
import { useQuery } from "@tanstack/react-query";

export const useGetGenreQuery = ({ cursor, limit, page }: PagingDto) => {
  return useQuery({
    queryKey: ["get-genre", cursor, limit, page],
    queryFn: () => genreApi.getGenre({ cursor, limit, page }),
  });
};

export const useGetGenreByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["get-genre-by-id", id],
    queryFn: () => genreApi.getGenreById(id),
  });
};
