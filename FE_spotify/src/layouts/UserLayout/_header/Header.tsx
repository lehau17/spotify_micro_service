import { Button } from "antd";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { SearchOutlined } from "@ant-design/icons";

export default function Header() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");
  const handlerPrev = () => {
    navigate(-1);
  };
  const handlerNext = () => {
    navigate(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate(0);
  };

  return (
    <>
      <header id="css-header">
        <div className="flex justify-between">
          <div className="header-left">
            <button onClick={handlerPrev}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button onClick={handlerNext}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="bg-gray-800 rounded-full flex items-center justify-between p-2 focus:outline-none focus:border-none w-[300px]">
            <SearchOutlined className="px-2" />
            <input
              className="outline-none text-white bg-gray-800 flex-1"
              placeholder="Searching....."
            />
          </div>

          <div className="header-right">
            {currentUser ? (
              <Button onClick={handleLogout}>Log out</Button>
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
