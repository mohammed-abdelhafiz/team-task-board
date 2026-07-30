import React, { useEffect, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Flame, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
    assignedTo?: string;
    dueDate?: string;
  }) => void;
  initialData?: Task | null;
  initialStatus?: TaskStatus;
  members: Array<{ _id: string; fullName: string; email: string }>;
  isPending: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  initialStatus = "todo",
  members,
  isPending,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setAssignedTo(initialData.assignedTo?._id || "");
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus(initialStatus);
      setAssignedTo("");
      setDueDate("");
    }
  }, [initialData, initialStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status: initialData ? status : initialStatus,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update task details and assignments below."
              : "Fill out details to create a task on this project board."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Design landing page mockup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={2}
              required
            />
          </div>

          {/* Priority radio pills */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Priority</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority("low")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all",
                  priority === "low"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <CheckCircle2 className="size-3.5" /> Low
              </button>
              <button
                type="button"
                onClick={() => setPriority("medium")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all",
                  priority === "medium"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold ring-1 ring-amber-500"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <Zap className="size-3.5" /> Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority("high")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all",
                  priority === "high"
                    ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold ring-1 ring-rose-500"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <Flame className="size-3.5" /> High
              </button>
            </div>
          </div>

          {/* Assignee & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee" className="text-xs font-semibold">
                Assignee
              </Label>
              <select
                id="task-assignee"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due-date" className="text-xs font-semibold">
                Due Date
              </Label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Status (when editing) */}
          {initialData && (
            <div className="space-y-1.5">
              <Label htmlFor="task-status" className="text-xs font-semibold">
                Status
              </Label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-description" className="text-xs font-semibold">
              Description
            </Label>
            <Textarea
              id="task-description"
              placeholder="Add optional task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
