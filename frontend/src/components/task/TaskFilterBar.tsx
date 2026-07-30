import React from "react";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  status: TaskStatus | "";
  onStatusChange: (status: TaskStatus | "") => void;
  priority: TaskPriority | "";
  onPriorityChange: (priority: TaskPriority | "") => void;
  assignedTo: string;
  onAssigneeChange: (assigneeId: string) => void;
  members: Array<{ _id: string; fullName: string; email: string }>;
  viewMode: "board" | "list";
  onViewModeChange: (mode: "board" | "list") => void;
  onResetFilters: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assignedTo,
  onAssigneeChange,
  members,
  viewMode,
  onViewModeChange,
  onResetFilters,
}) => {
  const isFiltered = Boolean(searchQuery || status || priority || assignedTo);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input & Dropdowns */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full">
        {/* Search */}
        <div className="relative w-full md:w-auto md:min-w-[200px] flex-1 sm:max-w-xs min-w-0">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs"
          />
        </div>

        {/* Priority Filter */}
        <select
          aria-label="Filter by priority"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
          className="h-9 w-full sm:w-auto flex-1 sm:flex-none min-w-0 rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Priorities</option>
          <option value="high">🔥 High</option>
          <option value="medium">⚡ Medium</option>
          <option value="low">🍃 Low</option>
        </select>

        {/* Status Filter */}
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
          className="h-9 w-full sm:w-auto flex-1 sm:flex-none min-w-0 rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Assignee Filter */}
        <select
          aria-label="Filter by assignee"
          value={assignedTo}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="h-9 w-full sm:w-auto flex-1 sm:flex-none min-w-0 rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Assignees</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.fullName}
            </option>
          ))}
        </select>

        {/* Reset filters pill */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* View Toggle (Board vs List) */}
      <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1 self-start sm:self-auto shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("board")}
          className={cn(
            "h-7 gap-1 px-2.5 text-xs font-medium transition-all",
            viewMode === "board"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="size-3.5" />
          Board
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "h-7 gap-1 px-2.5 text-xs font-medium transition-all",
            viewMode === "list"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <List className="size-3.5" />
          List
        </Button>
      </div>
    </div>
  );
};
