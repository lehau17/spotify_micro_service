import Header from "./_header/Header";
import Footer from "./_footer/Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "./_sidebar/Sidebar";
import PlayMusic from "../../modules/UserModule/playMusic/PlayMusic";
import { ModalProvider } from "../../globalContext/ModalContext";

export default function UserLayout() {
  return (
    <ModalProvider>
      <div className="container mx-auto flex flex-col">
        <div className="w-[100%]">
          <Header />
        </div>
        <div className="w-full flex pt-10">
          <div style={{ width: "20%" }}>
            <Sidebar />
          </div>
          <div style={{ width: "80%" }}>
            <div className="pt-9">
              <Outlet />
              <div>{PlayMusic()}</div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}
