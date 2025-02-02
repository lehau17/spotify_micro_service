function Profile() {
  const access_token = localStorage.getItem("access_token");
  return (
    <div className="mx-auto max-w-3xl bg-slate-900 rounded-lg p-5 flex flex-col">
      <div className="text-center text-xl font-bold">Hồ sơ của tôi</div>
      <div>
        <img src="" alt="avatar" />
      </div>
    </div>
  );
}

export default Profile;
