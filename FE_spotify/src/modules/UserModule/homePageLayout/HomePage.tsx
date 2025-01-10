import { Card } from "antd";
import "./homepage.css";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom";
import { useGetSingerQuery } from "@/query/user"; // Assuming this is your query hook
import { UserResponseDto } from "@/types/ver2/auth.type";
import { useGetRecentSongQuery } from "@/query/recent_song";
import { RecentSongResponse } from "@/types/ver2/recent-song.type";
import Loading from "@/components/ui/loading";

export default function HomePage() {
  const [user, setUser] = useState<UserResponseDto[]>([]);
  const [recentSong, setRecentSong] = useState<RecentSongResponse[]>([]);
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

  const renderArtists = (data: any[]) => {
    if (data.length > 0) {
      return data.map((itemUser, index: number) => {
        if (index > 6) return;
        return (
          <Link className="" key={itemUser.id} to={``}>
            <Card
              className="items-artists"
              hoverable
              style={{ width: 200 }}
              cover={
                <img
                  className="img-artists"
                  alt="example"
                  src={itemUser.avatar}
                />
              }
            >
              <h1 className="text-white font-bold text-xl">{itemUser.name}</h1>
              <h1 className="text-[gray]  text-[12px] my-2">
                {itemUser.role.name}
              </h1>
            </Card>
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
              className="items-artists"
              hoverable
              style={{ width: 200 }}
              cover={
                <img
                  className="img-artists"
                  alt="example"
                  src={itemUser.song.song_image}
                />
              }
            >
              <h1 className="text-white font-bold text-xl">
                {itemUser.song.song_name}
              </h1>
            </Card>
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
        <a className="text-xl font-bold">Nghệ sĩ phổ biến</a>
        <Link to="">Xem tất cả</Link>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderArtists(user)}
      </div>
      {isAuth && !isLoadingRecentSong && (
        <>
          <div className="tittle pt-9 pl-5 flex items-center justify-between">
            <a className="text-xl font-bold">Mới phát gần đây</a>
            <Link to="">Xem tất cả</Link>
          </div>
          <div className="artists">{renderRecentSong(recentSong)} </div>
        </>
      )}
      <div className="tittle pt-9 pl-5 flex items-center justify-between">
        <a className="text-xl font-bold">Những bản nhạc phổ biến hiện nay</a>
        <Link to="">Xem tất cả</Link>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderArtists(user)}
      </div>
    </section>
  );
}
