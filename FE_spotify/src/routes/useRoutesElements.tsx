import { useRoutes, Navigate } from "react-router-dom";
import HomePage from "../modules/UserModule/homePageLayout/HomePage";
import UserLayout from "../layouts/UserLayout";
import DetailArtists from "../modules/UserModule/detailArtists/DetailArtists";
import Playlist from "../modules/UserModule/playList/Playlist";
import Genre from "../modules/UserModule/genre/Genre";
import GenreAndSong from "../modules/UserModule/genreAndSong/GenreAndSong";
import LoginForm from "@/modules/AuthModule/Login/Login";

const useRoutesElements = () => {
  const isAuthenticated = !!localStorage.getItem("access_token"); // Kiểm tra accessToken

  const element = useRoutes([
    {
      path: "",
      element: isAuthenticated ? (
        <UserLayout />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "detail-artists/:id",
          element: <DetailArtists />,
        },
        {
          path: "play-list/:id",
          element: <Playlist />,
        },
        {
          path: "genre",
          element: <Genre />,
        },
        {
          path: "genre/:id",
          element: <GenreAndSong />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginForm />, // Thay bằng component trang login của bạn
    },
  ]);

  return element;
};

export default useRoutesElements;
