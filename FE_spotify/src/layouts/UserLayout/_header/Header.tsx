import { Button } from "antd";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") as string);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate(0);
  };

  return (
    <>
      <header id="css-header" className="w-full">
        <div className="flex justify-between pl-5">
          <button className="logo-spotify">
            <i className="fa-brands fa-spotify mr-2"></i>
            <span>Spotify</span>
          </button>

          <div className="bg-gray-800 rounded-full flex items-center justify-between p-2 focus:outline-none focus:border-none w-[300px]">
            <SearchOutlined className="px-2" />
            <input
              className="outline-none text-white bg-gray-800 flex-1"
              placeholder="Searching....."
            />
          </div>

          <div className="header-right">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-[40px] h-[40px] rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuItem>Hồ Sơ</DropdownMenuItem>
                  <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button className="btn-signup">Sign up</Button>
                <Button
                  className="btn-signin"
                  onClick={() => {
                    navigate("login");
                  }}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
