import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-xl flex-col items-center gap-4 p-4">
        <h1 className="text-4xl font-bold italic">Task Board</h1>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
