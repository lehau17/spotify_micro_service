import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./detailArtists.css";
import { useGlobalContext } from "../../../globalContext/GlobalContext";
import { apiSendFollow } from "../../../apis/apiSendFollow";
import { apiUnfollow } from "../../../apis/apiUnfollow";
import { Button } from "antd";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";

import { apiGetFriend } from "../../../apis/apiGetFriend";
import { UserResponseDto } from "@/types/ver2/auth.type";
import { SongDto } from "@/types/ver2/song.response";
import { useGetSingerDetailQuery } from "@/query/song";
import { DetailSingerResponseDto } from "@/types/ver2/user.type";
import { toast } from "react-toastify";

export default function DetailArtists() {
  // const { currentUser } = useAppSelector((state) => state.currentUser)
  // const { userId } = currentUser?.user
  const currentUser = JSON.parse(localStorage.getItem("user") as string);
  const { id } = useParams();

  const { setIdMusic } = useGlobalContext();
  const { setNameArtists } = useGlobalContext();
  const [follow, isFollow] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [dataDetail, setDataDetail] = useState<DetailSingerResponseDto>();

  const { data, isLoading, isError, error } = useGetSingerDetailQuery(
    Number(id)
  );
  // const dispatch = useDispatch<AppDispatch>();
  // Api getUser
  // const callApiDetailUser = async () => {
  //   const result = await apiDetailArtists(id);
  //   setNameArtists(result.name);
  //   setDataUser(result);
  // };

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
                      width: "70px",
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

  const callApiSendFollow = async (id: number) => {
    const { userId } = currentUser.user;
    const result = await apiSendFollow({ userId, followingId: id });
    if (result) {
      isFollow(true);
    }
  };

  const callApiUnFollow = async (id: number) => {
    const { userId } = currentUser.user;
    const result = await apiUnfollow({ userId, followingId: id });
    if (result) {
      isFollow(false);
    }
  };

  const handleAddFriend = async () => {
    if (currentUser.user.userId === id) {
      return;
    }
    const payload = {
      userId: currentUser.user.userId,
      friendId: Number(id),
      roomChat: `${currentUser.user.userId}-${id}`,
    };
    // await dispatch(addFriend(payload));
    callApiGetFriend();
  };

  const handleRemoveFriend = (id: string | undefined) => {
    if (id) {
      // dispatch(deleteFriend(id));
      callApiGetFriend();
    }
  };

  const callApiGetFriend = async () => {
    const result = await apiGetFriend(currentUser.user.userId);
    if (result) {
      const checkFriend = result.some(
        (friend) => friend.friendId === Number(id)
      );
      setIsFriend(checkFriend);
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
            {follow ? (
              <button
                onClick={() => {
                  callApiUnFollow(Number(id));
                }}
              >
                <i className="fa-solid fa-circle-check mr-1"></i>Follow
              </button>
            ) : (
              <button
                onClick={() => {
                  callApiSendFollow(Number(id));
                }}
              >
                {dataDetail?.isFollow ? "Unfollow" : "Follow"}
              </button>
            )}
          </button>
          {isFriend ? (
            <Button
              type="link"
              icon={<UserOutlined />} // biểu tượng cho "isFriend"
              className="text-white bg-green-600 mt-3 ml-5 hover:bg-green-700 hover:font-semibold hover:text-white"
              onClick={() => handleRemoveFriend(id)} // Hủy kết bạn
            >
              Hủy kết bạn
            </Button>
          ) : (
            <Button
              type="link"
              icon={<UserAddOutlined />} // biểu tượng cho "Thêm bạn bè"
              className="text-white bg-green-600 mt-3 ml-5"
              onClick={handleAddFriend} // Thêm bạn bè
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
