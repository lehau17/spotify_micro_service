import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { Avatar, Button, Col, Popover, Row, Space, Typography } from "antd";
import { useModal } from "../../../globalContext/ModalContext";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useEffect, useState } from "react";
import { getPlaylistByUser } from "../../../apis/apiPlayList/apiGetPlayListByUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreatePlaylistMutation,
  useGetPlayListOfMeQuery,
} from "@/query/playlist";
import { CreatePlaylistDto } from "@/types/ver2/playlist.type";
const { Title, Text } = Typography;

export default function Sidebar() {
  const { openModal, openPopover, popover } = useModal();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  // const playlists = useAppSelector((state) => state.playlist.playLists);
  const playListDetailById = useAppSelector(
    (state) => state.playlist.playListDetailById
  );
  const [currentId, setCurrentId] = useState<number>();
  const useCreatePlaylist = useCreatePlaylistMutation();
  const { data: myPlayList } = useGetPlayListOfMeQuery({
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    dispatch(getPlaylistByUser(currentUser?.user?.userId));
  }, [playListDetailById, currentUser]);

  const handleCreatePlayList = async () => {
    const newPlaylist: CreatePlaylistDto = {
      image_path:
        "https://images.macrumors.com/t/hi1_a2IdFGRGMsJ0x31SdD_IcRk=/1600x/article-new/2018/05/apple-music-note.jpg",
      playlist_name: `Danh sách phát của tôi #${
        (myPlayList?.data?.data?.length as number) + 1
      }`,
      description: "Your description here",
    };

    const result = await useCreatePlaylist.mutateAsync(newPlaylist);
    if (result) {
      navigate(`/play-list/${result.data.data.id}`);
    } else {
    }
  };

  return (
    <div className="sidebar mt-3  mr-2" style={{ width: "300px" }}>
      <div className="sidebar-top mb-2">
        <div className="flex justify-between items-center library mt-7">
          <NavLink
            to="/"
            className="flex items-center text-white no-underline hover:text-gray-400"
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-house mr-2"></i>
            <span>Home</span>
          </NavLink>
        </div>
        {/* <NavLink
          to={"search"}
          className={({ isActive }) =>
            isActive ? "my-active btn-search" : "btn-search"
          }
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Search
        </NavLink> */}
      </div>
      <div className="sidebar-bottom">
        <div>
          <div className="flex justify-between items-center library mb-7">
            <NavLink
              to="/genre"
              className="flex items-center text-white no-underline hover:text-gray-400"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-list mr-2"></i>
              <span>Phân loại</span>
            </NavLink>
          </div>

          <div className="flex justify-between items-center library mb-7">
            <div>
              <i className="fa-solid fa-lines-leaning"></i>Thư Viện
            </div>
            <button>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <i className="fa-solid fa-plus"></i>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel
                    onClick={() => {
                      handleCreatePlayList();
                    }}
                  >
                    Tạo danh sách phát mới
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </button>
          </div>

          <div className="create-playlist ">
            {!currentUser ? (
              <div>
                <p className="font-bold">Create your first playlist</p>
                <p className="font-medium">It's easy, we'll help you</p>

                <Popover
                  style={{ backgroundColor: "blue", left: "10%" }}
                  content={<a onClick={popover}>Close</a>}
                  title={
                    <>
                      <p className="text-lg font-bold">Create a playlist</p>
                      <p>Log in to create and share playlists.</p>
                      <br />
                      <Button onClick={openModal}>Login</Button>
                    </>
                  }
                  trigger="click"
                  open={openPopover}
                  placement="rightTop"
                  onOpenChange={popover}
                >
                  <Button
                    type="primary"
                    className="btn-createPlaylist"
                    onClick={popover}
                  >
                    Create playlist
                  </Button>
                </Popover>
              </div>
            ) : (
              <div className="p-3">
                <p className="font-bold text-white">Your Playlists</p>
                <ul>
                  {myPlayList?.data?.data.length === 0 ? (
                    <>
                      <li className="text-[12px]">
                        Hãy cùng tạo danh sách phát nhạc để tận hưởng âm nhạc
                        bạn nhé !
                      </li>
                      <Button
                        type="primary"
                        className="btn-createPlaylist"
                        onClick={handleCreatePlayList}
                      >
                        Create new playlist
                      </Button>
                    </> // Hiển thị thông báo nếu danh sách trống
                  ) : (
                    myPlayList?.data?.data.map((playlist) => (
                      <li
                        key={playlist.id}
                        onClick={() => {
                          navigate(`./play-list/${playlist.id}`);
                          setCurrentId(playlist.id);
                        }}
                        className={`relative ${
                          currentId === playlist.id
                            ? "bg-opacity-10"
                            : "bg-transparent"
                        } 
                            hover:bg-opacity-20 
                            hover:bg-gray-500 
                            transition-all duration-300 
                            py-1 px-2 
                            rounded-lg cursor-pointer`}
                      >
                        {/* Tạo lớp overlay khi hover */}
                        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>

                        <Row align="middle" style={{ marginBottom: "10px" }}>
                          <Col span={6}>
                            <Avatar
                              shape="square"
                              size={45}
                              src={playlist.image_path}
                              alt="Playlist cover"
                            />
                          </Col>
                          <Col span={18}>
                            <Space direction="vertical">
                              <Title
                                style={{
                                  color: "white",
                                  margin: "0",
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  lineHeight: "0.5",
                                }}
                              >
                                {playlist.playlist_name}
                              </Title>
                              <Text
                                style={{
                                  color: "gray",
                                  fontSize: "10px",
                                  margin: "0",
                                  lineHeight: "1",
                                }}
                              >
                                Danh sách phát • {currentUser.user?.name}
                              </Text>
                            </Space>
                          </Col>
                        </Row>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="footer-sidebar-bottom">
            <span>Legal</span>
            <span>Safety & Privacy Center</span>
            <span>Privacy Policy</span>
            <span>Cookies</span>
            <span>About Ads</span>
            <span>Accessibility</span>
            <span>Cookies</span>
          </div>
          <div className="languages">
            <button className="btn-languages">
              <i className="fa-solid fa-earth-americas mr-2"></i>English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
