import "../homePageLayout/homepage.css";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom";
import { useGetRecentSongQuery } from "@/query/recent_song";
import { RecentSongResponse } from "@/types/ver2/recent-song.type";
import Loading from "@/components/ui/loading";
import Card from "@/components/ui/card";
export default function RecentSong() {
  const [recentSong, setRecentSong] = useState<RecentSongResponse[]>([]);

  const { data: dataRecentSong, isLoading } = useGetRecentSongQuery({
    page: 1,
    limit: 50,
    cursor: undefined,
  });

  useEffect(() => {
    if (dataRecentSong) {
      setRecentSong(dataRecentSong.data.data);
    }
  }, [dataRecentSong]);

  const renderRecentSong = (data: RecentSongResponse[]) => {
    if (data.length > 0) {
      return data.map((song) => {
        return (
          <Link className="" key={song.id} to={`artist/${song.id}`}>
            <Card imageSrc={song.song.song_image} name={song.song.song_name} />
          </Link>
        );
      });
    }
    return <div>No artists found</div>; // Return a message if no artists
  };

  return (
    <section className="homePage p-3">
      <div className="tittle pt-9 pl-5 flex items-center justify-between">
        <a className="text-xl font-bold my-5">Bài hát bạn nghe gần đây</a>
      </div>
      <div className="artists">
        {isLoading ? <Loading /> : renderRecentSong(recentSong)}
      </div>
    </section>
  );
}
