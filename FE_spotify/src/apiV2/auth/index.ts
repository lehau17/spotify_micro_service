import api from "@/apis/apiUtil";
import { LoginRequestBody } from "@/types/ver2/auth.type";

const authApi = {
  login: (body: LoginRequestBody) => api.post("/auth/login", body),
};

export default authApi;
