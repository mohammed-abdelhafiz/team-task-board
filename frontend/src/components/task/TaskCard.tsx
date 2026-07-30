import React from "react";
import type { Task, TaskStatus } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onDelete,
  onEdit,
  onDragStart,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 bg-rose-500/10 font-semibold text-rose-600 dark:text-rose-400"
          >
            <Flame className="size-3 text-rose-500" />
            HIGH
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400"
          >
            <Zap className="size-3 text-amber-500" />
            MEDIUM
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="size-3 text-emerald-500" />
            LOW
          </Badge>
        );
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return parts
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = React.useMemo(() => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today && task.status !== "done";
  }, [task.dueDate, task.status]);

  const formattedDate = React.useMemo(() => {
    if (!task.dueDate) return null;
    return new Date(task.dueDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }, [task.dueDate]);

  return (
    <article
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData("taskId", task._id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(e, task._id);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md",
        isDragging && "opacity-40 ring-2 ring-primary"
      )}
    >
      <div>
        {/* Card Header: Priority & Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="cursor-grab text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
              <GripVertical className="size-4" />
            </span>
            {getPriorityBadge(task.priority)}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                />
              }
            >
              <MoreVertical className="size-4" />
              <span className="sr-only">Task actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Move status
              </DropdownMenuLabel>
              <DropdownMenuItem
                disabled={task.status === "todo"}
                onClick={() => onStatusChange(task._id, "todo")}
              >
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={task.status === "in_progress"}
                onClick={() => onStatusChange(task._id, "in_progress")}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={task.status === "done"}
                onClick={() => onStatusChange(task._id, "done")}
              >
                Done
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 size-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 className="mr-2 size-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task Title & Description */}
        <h3 className="mt-3 font-semibold text-foreground tracking-tight line-clamp-2 break-words">
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1.5 text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed break-words">
            {task.description}
          </p>
        )}
      </div>

      {/* Card Footer: Due Date & Assignee */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground min-w-0">
        {formattedDate ? (
          <div
            className={cn(
              "flex items-center gap-1 font-medium",
              isOverdue
                ? "text-rose-500 dark:text-rose-400"
                : "text-muted-foreground"
            )}
            title={isOverdue ? "Overdue task!" : "Due date"}
          >
            {isOverdue ? (
              <AlertCircle className="size-3.5" />
            ) : (
              <Calendar className="size-3.5" />
            )}
            <span>{formattedDate}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <Clock className="size-3.5" />
            <span>No deadline</span>
          </div>
        )}

        {task.assignedTo ? (
          <div
            className="flex items-center gap-1.5"
            title={`Assigned to ${task.assignedTo.fullName || "User"}`}
          >
            <Avatar size="sm" className="size-6 border border-border">
              <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                {getInitials(task.assignedTo.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate text-[11px] font-medium text-foreground">
              {task.assignedTo.fullName || "User"}
            </span>
          </div>
        ) : (
          <span className="text-[11px] italic text-muted-foreground/60">
            Unassigned
          </span>
        )}
      </div>
    </article>
  );
};
