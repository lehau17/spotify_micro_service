import { Link, useParams } from "react-router-dom";

import { Table } from "antd";

import moment from "moment";
import "./../playList/Playlist.css";

import { ClockCircleOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../../globalContext/GlobalContext";
import { useGetGenreByIdQuery } from "@/query/genre";
import { SongDto } from "@/types/ver2/song.response";

export default function GenreAndSong() {
  const { id } = useParams();
  const { setIdMusic } = useGlobalContext();
  const { data } = useGetGenreByIdQuery(Number(id));

  const handlePlayMusic = (id: any) => {
    setIdMusic(id);
  };
  // Filter songs based on the genreId from URL params
  const filteredSongs = data?.data.data.songs.filter(
    (song: SongDto) => song.genre_id === Number(id)
  );

  // const genreFind = songGenre.find(
  //   (genre: TypeGenre) => Number(id) === genre.genreId
  // ) as TypeGenre | undefined;

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      width: "5%",
      render: (_: any, record: any, index: any) => <span>{index + 1}</span>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (_: any, record: SongDto) => {
        // const artist = users.find(
        //   (user: TypeUser) => user.id === record.user_id
        // );

        return (
          <div className="flex">
            <img
              src={record.song_image}
              alt={record.song_name}
              className="rounded-full"
              style={{ width: "50px", height: "50px" }}
            />

            <div className="pl-5">
              <div>{record.song_name}</div>
              <div style={{ fontSize: "14px", color: "gray" }}>
                <Link
                  to={`/detail-artists/${record?.user_id}`}
                  className="hover:text-green-500"
                >
                  Nghệ sĩ
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày thêm",
      dataIndex: "addedDate",
      key: "addedDate",
      render: (_: any, record: SongDto) => {
        const formattedDate = moment(record.created_at).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      width: "15%",
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: "duration",
      key: "duration",
      width: "10%",
    },
    {
      dataIndex: "action",
      key: "action",
      width: "10%",
    },
  ];

  return (
    <div>
      <div className="text-[40px] text-white font-bold h-[150px]  bg-green-600  px-5 py-2 rounded w-full flex items-center">
        {data ? data.data.data.nameGenre : ""} song
      </div>
      <Table
        columns={columns}
        dataSource={filteredSongs}
        rowKey="id"
        className="custom-transparent-table mt-5 px-5"
        pagination={{ pageSize: 10 }} // Optional: Controls pagination
        onRow={(record) => ({
          onClick: () => {
            handlePlayMusic(record.id);
          },
        })}
      />
    </div>
  );
}
