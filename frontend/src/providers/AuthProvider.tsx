import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getMe } from "@/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useAuthStore();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getMe();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setLoading, setUser]);
  return <>{children}</>;
};
