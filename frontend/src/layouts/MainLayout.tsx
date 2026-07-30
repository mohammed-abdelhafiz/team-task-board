import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:p-6 lg:pl-72 lg:pr-8 min-w-0 max-w-full overflow-x-hidden">{children}</div>
    </>
  );
}
