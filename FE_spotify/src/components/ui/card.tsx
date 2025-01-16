import { CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Card({ imageSrc, name }: { imageSrc: string; name: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col p-3 hover:bg-opacity-20 hover:bg-gray-100 relative group">
      <img
        className="rounded-full"
        src={imageSrc}
        alt={name} // Cung cấp alt cho hình ảnh
      />
      <p className="text-[18px] font-bold py-3">{name}</p>

      {/* Nút play sẽ được ẩn mặc định và chỉ hiển thị khi hover vào thẻ cha */}
      <div className="bg-[green] text-center absolute bottom-20 right-0 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <CaretRightOutlined className="text-4xl" />
      </div>
    </div>
  );
}

export default Card;
