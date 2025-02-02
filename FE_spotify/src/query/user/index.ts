import userApi from "@/apiV2/user";
import { PagingDto } from "@/types/ver2/paging.type";
import { useQuery } from "@tanstack/react-query";

export const useGetSingerQuery = ({ cursor, limit, page }: PagingDto) => {
  return useQuery({
    queryKey: ["get singer", cursor, limit, page],
    queryFn: () => userApi.getSinger({ cursor, limit, page }),
  });
};

export const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ["get my profile"],
    queryFn: () => userApi.myProfile(),
  });
};
