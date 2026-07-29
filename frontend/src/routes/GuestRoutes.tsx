import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";

export default function GuestRoutes() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
