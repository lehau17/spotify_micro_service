import followerApi from "@/apiV2/follower";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useToggleFollowingMutation = () => {
  return useMutation({
    mutationFn: followerApi.togger,
    onSuccess: () => {
      toast.success("Bạn đã theo dõi thành công ");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
