import "./homepage.css";
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

export default function HomePage() {
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

  const renderArtists = (data: any[]) => {
    if (data.length > 0) {
      return data.map((itemUser, index: number) => {
        if (index > 4) return;
        return (
          <Link className="" key={itemUser.id} to={`/artist/${itemUser.id}`}>
            <Card imageSrc={itemUser.avatar} name={itemUser.name} />
          </Link>
        );
      });
    }
    return <div>No artists found</div>; // Return a message if no artists
  };

  const renderRecentSong = (data: RecentSongResponse[]) => {
    if (data.length > 0) {
      return data.map((itemUser, index: number) => {
        if (index > 6) return;
        return (
          <Link className="" key={itemUser.song.id} to={``}>
            <Card
              imageSrc={itemUser.song.song_image}
              name={itemUser.song.song_name}
            ></Card>
          </Link>
        );
      });
    }
    return <div className="p-5">Bạn chưa nghe bài hát nào nhỉ ?</div>; // Return a message if no artists
  };

  const renderPopularSong = (data: SongDto[]) => {
    if (data.length > 0) {
      return data.map((song, index: number) => {
        if (index > 6) return;
        return (
          <Link className="" key={song.id} to={``}>
            <Card imageSrc={song.song_image} name={song.song_name}></Card>
          </Link>
        );
      });
    }
    return <div className="p-5">Bạn chưa nghe bài hát nào nhỉ ?</div>; // Return a message if no artists
  };

  if (isError) {
    return <div>Error occurred while fetching data.</div>; // Show error state
  }

  return (
    <section className="homePage p-3">
      <div className="tittle pt-9 pl-5 flex items-center justify-between">
        <a className="text-xl font-bold pb-4">Nghệ sĩ phổ biến</a>
        <Link to="/popular-singer">Xem tất cả</Link>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderArtists(user)}
      </div>
      {isAuth && !isLoadingRecentSong && (
        <>
          <div className="tittle pt-9 pl-5 flex items-center justify-between">
            <a className="text-xl font-bold pb-4">Mới phát gần đây</a>
            <Link to="/recent-song">Xem tất cả</Link>
          </div>
          <div className="artists">{renderRecentSong(recentSong)} </div>
        </>
      )}
      <div className="tittle pt-9 pl-5 flex items-center justify-between">
        <a className="text-xl font-bold">Những bản nhạc phổ biến hiện nay</a>
        <Link to="">Xem tất cả</Link>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderPopularSong(popularSong)}
      </div>
    </section>
  );
}
