import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";

export const Sidebar = () => {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
    </>
  );
};
