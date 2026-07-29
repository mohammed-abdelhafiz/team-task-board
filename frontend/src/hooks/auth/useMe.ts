import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { queryKeys } from "@/lib/queryKeys";

export function useMe() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    retry: false,
  });
}
