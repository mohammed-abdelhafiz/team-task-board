import { logout } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export const useLogout = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logout successful");
      setUser(null);
      navigate("/login");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
