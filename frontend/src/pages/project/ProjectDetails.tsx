import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
} from "lucide-react";

import { createTask, deleteTask, getTasks, updateTask } from "@/api/task";
import {
  addProjectMember,
  deleteProject,
  getProject,
  removeProjectMember,
  updateProject,
} from "@/api/project";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useAuthStore } from "@/store/auth.store";
import { useTaskUpdates } from "@/hooks/useTaskUpdates";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { KanbanColumn } from "@/components/task/KanbanColumn";
import { TaskFilterBar } from "@/components/task/TaskFilterBar";
import { TaskModal } from "@/components/task/TaskModal";
import { ProjectSettingsModal } from "@/components/project/ProjectSettingsModal";

const columnDefinitions: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function ProjectDetails() {
  const { id: projectId = "" } = useParams();
  const client = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [assignedTo, setAssignedTo] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>("todo");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Queries & Socket updates
  const project = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  useTaskUpdates(projectId);

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId, status, priority, assignedTo],
    queryFn: () =>
      getTasks(projectId, {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(assignedTo ? { assignedTo } : {}),
      }),
  });

  const invalidateTasks = () =>
    client.invalidateQueries({ queryKey: ["tasks", projectId] });
  const refreshProject = () =>
    client.invalidateQueries({ queryKey: ["project", projectId] });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      priority: TaskPriority;
      status?: TaskStatus;
      assignedTo?: string;
      dueDate?: string;
    }) => createTask(projectId, data),
    onSuccess: () => {
      invalidateTasks();
      setIsTaskModalOpen(false);
      toast.success("Task created");
    },
    onError: () => toast.error("Could not create task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<{
        title: string;
        description: string;
        priority: TaskPriority;
        status: TaskStatus;
        assignedTo?: string;
        dueDate?: string;
      }>;
    }) => updateTask(projectId, taskId, data),
    onSuccess: () => {
      invalidateTasks();
      setIsTaskModalOpen(false);
      toast.success("Task updated");
    },
    onError: () => toast.error("Could not update task"),
  });

  const removeMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),
    onSuccess: () => {
      invalidateTasks();
      toast.success("Task deleted");
    },
    onError: () => toast.error("Could not delete task"),
  });

  const saveProjectMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      updateProject(projectId, data),
    onSuccess: () => {
      refreshProject();
      toast.success("Project updated");
    },
    onError: () => toast.error("Could not update project"),
  });

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => addProjectMember(projectId, email),
    onSuccess: () => {
      refreshProject();
      toast.success("Member added");
    },
    onError: () => toast.error("Could not add member"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeProjectMember(projectId, memberId),
    onSuccess: refreshProject,
    onError: () => toast.error("Could not remove member"),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      toast.success("Project deleted");
      navigate("/dashboard");
    },
    onError: () => toast.error("Could not delete project"),
  });

  // Task list and text search filtering
  const rawTasks: Task[] = (tasksQuery.data?.tasks as Task[]) || [];
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return rawTasks;
    const query = searchQuery.toLowerCase();
    return rawTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
    );
  }, [rawTasks, searchQuery]);

  // Project progress statistics
  const totalTasksCount = rawTasks.length;
  const completedTasksCount = rawTasks.filter((t) => t.status === "done").length;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  if (project.isLoading) {
    return (
      <main className="flex h-[70vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="size-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading project details...</span>
        </div>
      </main>
    );
  }

  if (project.isError || !project.data?.project) {
    return (
      <main className="flex h-[70vh] flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-destructive">Unable to load this project.</p>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 size-4" /> Return to Dashboard
          </Button>
        </Link>
      </main>
    );
  }

  const details = project.data.project;
  const members = (details.members || []).filter(
    (m: unknown): m is { _id: string; fullName: string; email: string } =>
      typeof m === "object" && m !== null && "_id" in m
  );
  const canManage = user?.role === "admin" || user?._id === details.owner._id;

  const handleCreateOrUpdateTask = (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
    assignedTo?: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      updateMutation.mutate({
        taskId: editingTask._id,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status || editingTask.status,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
        },
      });
    } else {
      createMutation.mutate({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status || modalInitialStatus,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
      });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({
      taskId,
      data: { status: newStatus },
    });
  };

  const openAddTaskModal = (initialColStatus: TaskStatus = "todo") => {
    setEditingTask(null);
    setModalInitialStatus(initialColStatus);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatus("");
    setPriority("");
    setAssignedTo("");
  };

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              invalidateTasks();
              refreshProject();
            }}
            title="Refresh data"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-4" />
          </Button>

          {canManage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Settings className="size-3.5" />
              Settings & Members
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => openAddTaskModal("todo")}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Project Banner Header Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {details.title}
              </h1>
              <Badge variant="secondary" className="text-xs font-medium">
                {canManage ? "Manager" : "Member"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {details.description || "No project description provided."}
            </p>
          </div>

          {/* Members & Progress Stack */}
          <div className="flex items-center gap-6 border-t border-border/40 pt-4 md:border-t-0 md:pt-0">
            {/* Team Avatars */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Team ({members.length})
              </span>
              <div className="flex -space-x-2">
                {members.slice(0, 4).map((member: { _id: string; fullName: string; email: string }) => (
                  <Avatar key={member._id} size="sm" className="size-7 border-2 border-background">
                    <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                      {member.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 4 && (
                  <div className="flex size-7 items-center justify-center rounded-full bg-muted border-2 border-background text-[10px] font-bold text-muted-foreground">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>

            {/* Completion Progress */}
            <div className="w-36 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">{completionPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        assignedTo={assignedTo}
        onAssigneeChange={setAssignedTo}
        members={members}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={resetFilters}
      />

      {/* Main Board vs List View */}
      {tasksQuery.isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-xs text-muted-foreground">Loading task board...</p>
        </div>
      ) : tasksQuery.isError ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-xs text-destructive">Unable to load tasks.</p>
        </div>
      ) : viewMode === "board" ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {columnDefinitions.map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === column.value
            );
            return (
              <KanbanColumn
                key={column.value}
                title={column.label}
                status={column.value}
                tasks={columnTasks}
                onStatusChange={handleStatusChange}
                onDelete={(taskId) => removeMutation.mutate(taskId)}
                onEdit={openEditTaskModal}
                onAddTask={openAddTaskModal}
              />
            );
          })}
        </div>
      ) : (
        /* Table / List View */
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3.5">Task Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="p-3.5 font-medium text-foreground">
                      <div>
                        <span>{task.title}</span>
                        {task.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <select
                        aria-label={`Change status for ${task.title}`}
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value as TaskStatus)
                        }
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant="outline"
                        className="capitalize text-[11px]"
                      >
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar size="sm" className="size-5">
                            <AvatarFallback className="text-[9px] font-bold">
                              {task.assignedTo.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignedTo.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditTaskModal(task)}
                          className="size-7 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeMutation.mutate(task._id)}
                          className="size-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-xs text-muted-foreground"
                    >
                      No tasks found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Dialog Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
        initialStatus={modalInitialStatus}
        members={members}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Project Settings Modal */}
      {canManage && (
        <ProjectSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          project={{
            _id: details._id,
            title: details.title,
            description: details.description,
            owner: details.owner,
            members,
          }}
          onSaveProject={(data) => saveProjectMutation.mutate(data)}
          onAddMember={(email) => addMemberMutation.mutate(email)}
          onRemoveMember={(memberId) => removeMemberMutation.mutate(memberId)}
          onDeleteProject={() => deleteProjectMutation.mutate()}
          isSaving={saveProjectMutation.isPending}
          isAddingMember={addMemberMutation.isPending}
        />
      )}
    </main>
  );
}
