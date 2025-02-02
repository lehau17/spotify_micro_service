import { useGetMyProfileQuery } from "@/query/user";

function Profile() {
  const { data } = useGetMyProfileQuery();
  const user = data?.data.data;

  return (
    <div className="mx-auto max-w-3xl bg-slate-900 rounded-lg p-4 flex flex-col shadow-xl">
      {/* Tiêu đề */}
      <div className="text-center text-3xl font-bold text-white my-6">
        Hồ sơ của tôi
      </div>

      {/* Banner */}
      <div
        className="relative h-[300px] rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${user?.banner})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Avatar */}
      </div>
      <img
        src={user?.avatar}
        alt="avatar"
        className="absolute bottom-36 right-[510px] transform w-48 h-w-48 border-4 border-white rounded-full shadow-lg object-cover"
      />

      {/* Thông tin người dùng */}
      <div className="mt-24 text-white space-y-4">
        {/* Tên */}
        <div className="flex items-center">
          <label className="min-w-[120px] text-lg font-medium">Tên:</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="flex-1 bg-transparent border-b border-gray-600 focus:border-white focus:outline-none p-1"
          />
        </div>

        {/* Email */}
        <div className="flex items-center">
          <label className="min-w-[120px] text-lg font-medium">Email:</label>
          <input
            type="text"
            value={user?.account || ""}
            readOnly
            className="flex-1 bg-transparent border-b border-gray-600 focus:border-white focus:outline-none p-1"
          />
        </div>

        {/* Điện thoại */}
        <div className="flex items-center">
          <label className="min-w-[120px] text-lg font-medium">
            Điện thoại:
          </label>
          <input
            type="text"
            value={user?.chanalName || ""}
            readOnly
            className="flex-1 bg-transparent border-b border-gray-600 focus:border-white focus:outline-none p-1"
          />
        </div>

        {/* Địa chỉ */}
        <div className="flex items-center">
          <label className="min-w-[120px] text-lg font-medium">Địa chỉ:</label>
          <input
            type="text"
            value={user?.nationality || ""}
            readOnly
            className="flex-1 bg-transparent border-b border-gray-600 focus:border-white focus:outline-none p-1"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
