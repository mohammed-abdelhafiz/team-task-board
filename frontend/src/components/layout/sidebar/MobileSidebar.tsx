import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "../Logo";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="p-6">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SidebarNav />
        </SheetHeader>
        <SheetFooter>
          <SidebarFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
