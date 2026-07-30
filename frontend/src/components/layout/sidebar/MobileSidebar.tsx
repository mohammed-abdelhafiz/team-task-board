import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "../Logo";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export const MobileSidebar = () => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur px-4 py-3 shadow-xs">
      <Logo />
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon-sm" className="size-9 rounded-xl">
              <Menu className="size-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="flex flex-col h-full p-6">
          <SheetHeader className="pb-4 text-left">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNav />
          </div>
          <SheetFooter className="mt-auto pt-4 border-t border-border/40">
            <SidebarFooter />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
};
