import "../homePageLayout/homepage.css";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom";
import { useGetSingerQuery } from "@/query/user"; // Assuming this is your query hook
import { UserResponseDto } from "@/types/ver2/auth.type";
import { useGetRecentSongQuery } from "@/query/recent_song";
import { RecentSongResponse } from "@/types/ver2/recent-song.type";
import Loading from "@/components/ui/loading";
import { SongDto } from "@/types/ver2/song.response";
import { useGetSongPopularQuery } from "@/query/song";
import Card from "@/components/ui/card";
export default function PopularSinger() {
  const [user, setUser] = useState<UserResponseDto[]>([]);
  const [recentSong, setRecentSong] = useState<RecentSongResponse[]>([]);
  const [popularSong, setPopularSong] = useState<SongDto[]>([]);
  const isAuth = !!localStorage.getItem("access_token");
  const { data, isLoading, isError } = useGetSingerQuery({
    page: 1,
    limit: 50,
  });

  const { data: dataRecentSong, isLoading: isLoadingRecentSong } =
    useGetRecentSongQuery({
      page: 1,
      limit: 50,
      cursor: undefined,
    });

  const { data: dataPopularSong, isLoading: isLoadingPopularSong } =
    useGetSongPopularQuery({
      page: 1,
      limit: 50,
      cursor: undefined,
    });

  useEffect(() => {
    if (data) {
      setUser(data.data.data);
    }
  }, [data]);

  useEffect(() => {
    if (dataRecentSong) {
      setRecentSong(dataRecentSong.data.data);
    }
  }, [dataRecentSong]);

  useEffect(() => {
    if (dataPopularSong) {
      setPopularSong(dataPopularSong.data.data);
    }
  }, [dataPopularSong]);

  const renderArtists = (data: UserResponseDto[]) => {
    if (data.length > 0) {
      return data.map((itemUser) => {
        return (
          <Link className="" key={itemUser.id} to={`/artist/${itemUser.id}`}>
            <Card imageSrc={itemUser.avatar} name={itemUser.name} />
          </Link>
        );
      });
    }
    return <div>No artists found</div>; // Return a message if no artists
  };

  return (
    <section className="homePage p-3">
      <div className="tittle pt-9 pl-5 flex items-center justify-between">
        <a className="text-xl font-bold my-5">Nghệ sĩ phổ biến</a>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderArtists(user)}
      </div>
    </section>
  );
}
