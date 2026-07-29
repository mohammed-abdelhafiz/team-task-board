import { Logo } from "../Logo";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNav } from "./SidebarNav";

export const DesktopSidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 fixed border-r p-4">
      <Logo />
      <SidebarNav />
      <div className="mt-auto">
        <SidebarFooter />
      </div>
    </div>
  );
};
