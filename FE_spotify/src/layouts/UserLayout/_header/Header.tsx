import { Button } from "antd";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
