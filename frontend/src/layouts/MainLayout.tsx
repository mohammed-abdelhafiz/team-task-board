import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="p-6 md:pl-64">{children}</div>
    </>
  );
}
