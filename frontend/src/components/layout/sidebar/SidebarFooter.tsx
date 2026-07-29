import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";

export const SidebarFooter = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {user?.fullName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{user?.fullName}</span>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <LogOut />
        )}
      </Button>
    </div>
  );
};
