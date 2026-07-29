import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return user ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}
