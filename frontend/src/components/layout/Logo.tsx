import React from "react";
import { Kanban } from "lucide-react";

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-md shadow-primary/20">
        <Kanban className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-foreground leading-none">
          TaskBoard
        </span>
        <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
          Team Workspace
        </span>
      </div>
    </div>
  );
};
