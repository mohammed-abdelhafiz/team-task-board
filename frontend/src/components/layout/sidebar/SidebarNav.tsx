import { Button } from "@/components/ui/button";
import { LayoutDashboard, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "@/store/theme.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SidebarNav = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <Button variant="ghost" className="w-full justify-start py-4 pl-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 w-full"
            aria-label="Dashboard"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </Button>
      </li>
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <Button variant="ghost" className="w-full justify-start py-4 pl-1">
              {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
              Theme
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  );
};
