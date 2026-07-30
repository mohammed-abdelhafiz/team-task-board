import React, { useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onStatusChange,
  onDelete,
  onEdit,
  onAddTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const getStatusColor = (s: TaskStatus) => {
    switch (s) {
      case "todo":
        return {
          dot: "bg-sky-500",
          badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
          border: "border-sky-500/30",
        };
      case "in_progress":
        return {
          dot: "bg-purple-500",
          badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          border: "border-purple-500/30",
        };
      case "done":
        return {
          dot: "bg-emerald-500",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          border: "border-emerald-500/30",
        };
    }
  };

  const colors = getStatusColor(status);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col rounded-2xl border border-border/40 bg-muted/30 p-3.5 transition-all duration-200 min-h-[450px]",
        isDragOver && "border-primary ring-2 ring-primary/20 bg-primary/5"
      )}
    >
      {/* Column Header */}
      <div className="mb-3.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", colors.dot)} />
          <h2 className="font-semibold text-foreground text-sm tracking-tight">
            {title}
          </h2>
          <Badge
            variant="outline"
            className={cn("h-5 px-1.5 text-[11px] font-bold", colors.badge)}
          >
            {tasks.length}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onAddTask(status)}
          className="size-7 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground"
          title={`Add task to ${title}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Column Content / Cards List */}
      <div className="flex-1 space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask(status)}
            className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/50 p-4 text-center transition-colors hover:border-primary/50 hover:bg-background"
          >
            <p className="text-xs font-medium text-muted-foreground">
              No tasks in {title}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <Plus className="size-3" /> Add task
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
