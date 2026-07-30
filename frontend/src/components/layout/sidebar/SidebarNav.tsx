import { Button } from "@/components/ui/button";
import { LayoutDashboard, Monitor, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useThemeStore } from "@/store/theme.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const SidebarNav = () => {
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();

  const isDashboardActive = location.pathname.startsWith("/dashboard") || location.pathname === "/";

  return (
    <ul className="flex flex-col gap-1.5">
      <li>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start py-2.5 px-3 rounded-xl transition-all",
            isDashboardActive
              ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
              : "text-muted-foreground hover:text-foreground"
          )}
          render={<Link to="/dashboard" aria-label="Dashboard" />}
        >
          <LayoutDashboard className="size-4 mr-2" />
          <span>Dashboard</span>
        </Button>
      </li>
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="w-full justify-start py-2.5 px-3 rounded-xl text-muted-foreground hover:text-foreground"
              />
            }
          >
            {theme === "light" ? (
              <Sun className="size-4 mr-2" />
            ) : theme === "dark" ? (
              <Moon className="size-4 mr-2" />
            ) : (
              <Monitor className="size-4 mr-2" />
            )}
            <span>Theme</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 size-4" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 size-4" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 size-4" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  );
};
