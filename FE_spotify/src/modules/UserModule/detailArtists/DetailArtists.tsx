import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./detailArtists.css";
import { useGlobalContext } from "../../../globalContext/GlobalContext";
import { Button } from "antd";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";

import { useGetSingerDetailQuery } from "@/query/song";
import { DetailSingerResponseDto } from "@/types/ver2/user.type";
import { toast } from "react-toastify";
import { useToggleFollowingMutation } from "@/query/follower";

export default function DetailArtists() {
  // const { currentUser } = useAppSelector((state) => state.currentUser)
  // const { userId } = currentUser?.user
  const { id } = useParams();

  const { setIdMusic } = useGlobalContext();
  const { setNameArtists } = useGlobalContext();
  const [follow, isFollow] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [dataDetail, setDataDetail] = useState<DetailSingerResponseDto>();

  const { data, isLoading, isError, error, refetch } = useGetSingerDetailQuery(
    Number(id)
  );
  const useToggerMutation = useToggleFollowingMutation();

  const handleToggleFollowingMutation = async () => {
    await useToggerMutation.mutateAsync({ following_user_id: Number(id) });
    refetch();
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
    if (data) {
      setDataDetail(data.data.data);
    }
  }, [data]);

  // const apiCheckFollow = async () => {
  //   if (currentUser) {
  //     const result = await apiGetFollow(currentUser.user.userId, id);
  //     isFollow(result.isFollowing);
  //   }
  // };

  // Api getSong
  // const callApiGetSong = async () => {
  //   const result = await apiGetSongById(id);
  //   setDataSong(Array.isArray(result) ? result : [result]);
  // };

  const handlerTotalViewer = () => {
    let totalViewer = 0;
    if (dataDetail) {
      for (let i = 0; i < dataDetail.songs.length; i++) {
        totalViewer += dataDetail.songs[i].viewer;
      }
    }
    return totalViewer.toLocaleString("en-US");
  };

  const handlerGetIdMusic = (id: any) => {
    setIdMusic(id);
  };

  const renderTableSong = () => {
    if (dataDetail?.songs) {
      return dataDetail?.songs.map((itemSong, index) => {
        return (
          <>
            <button
              className="mb-3"
              onClick={() => {
                handlerGetIdMusic(itemSong.id);
              }}
            >
              <tr
                key={itemSong.id}
                className="flex items-center justify-between py-1"
              >
                <td className="flex items-center justify-center">
                  <p className="mx-3">{index + 1}</p>
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                    className="mx-3 rounded-lg"
                    src={itemSong.song_image}
                  />
                  <p className="mx-3">{itemSong.song_name}</p>
                </td>

                <td>{itemSong.viewer}</td>
                <td>{itemSong.duration}</td>
              </tr>
            </button>
          </>
        );
      });
    }
  };

  useEffect(() => {
    // callApiDetailUser();
    // callApiGetSong();
    // apiCheckFollow();
    // callApiGetFriend();
  }, [id]);

  return (
    <section className="detail-artists h-100">
      <div className="banner-artists">
        <img className="img-banner" src={dataDetail?.banner}></img>
        <div className="info-artists">
          <p className="name-artists">{dataDetail?.name}</p>
          <p className="viewer">{handlerTotalViewer() || 0} lượng nghe </p>
        </div>
      </div>

      <div className="song-artists">
        <div className="button">
          <button className="btn-play">
            <i className="fa-solid fa-circle-play"></i>
          </button>
          <button className="btn-follow mt-4">
            <button
              onClick={() => {
                // callApiSendFollow(Number(id));
                handleToggleFollowingMutation();
              }}
            >
              {dataDetail?.isFollow ? "Unfollow" : "Follow"}
            </button>
          </button>
          {isFriend ? (
            <Button
              type="link"
              icon={<UserOutlined />} // biểu tượng cho "isFriend"
              className="text-white bg-green-600 mt-3 ml-5 hover:bg-green-700 hover:font-semibold hover:text-white"
              onClick={
                () => {}
                // handleRemoveFriend(id)
              } // Hủy kết bạn
            >
              Hủy kết bạn
            </Button>
          ) : (
            <Button
              type="link"
              icon={<UserAddOutlined />} // biểu tượng cho "Thêm bạn bè"
              className="text-white bg-green-600 mt-3 ml-5"
              onClick={() => {}} // Thêm bạn bè
            >
              Thêm bạn bè
            </Button>
          )}
        </div>
        <div className="list-song">
          <h1 className="tittle-list-song mb-3 text-white">Popular</h1>
          <div>
            <table className="table-auto border-separate border-spacing-x-20">
              <tbody className="text-white">{renderTableSong()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
