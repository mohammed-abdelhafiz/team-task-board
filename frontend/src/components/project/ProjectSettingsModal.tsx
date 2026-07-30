import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Check,
  Loader2,
  Mail,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    title: string;
    description?: string;
    owner: { _id: string; fullName: string; email: string };
    members: Array<{ _id: string; fullName: string; email: string }>;
  };
  onSaveProject: (data: { title: string; description: string }) => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
  onDeleteProject: () => void;
  isSaving: boolean;
  isAddingMember: boolean;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveProject,
  onAddMember,
  onRemoveMember,
  onDeleteProject,
  isSaving,
  isAddingMember,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "members" | "danger">(
    "general"
  );
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");
  const [memberEmail, setMemberEmail] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProject({ title, description });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmail.trim()) {
      onAddMember(memberEmail.trim());
      setMemberEmail("");
    }
  };

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return parts
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Project Settings & Management</DialogTitle>
          <DialogDescription>
            Configure general details, team members, and project preferences.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            General Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
              activeTab === "members"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="size-3.5" />
            Team Members ({project.members.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("danger")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ml-auto",
              activeTab === "danger"
                ? "border-destructive text-destructive"
                : "border-transparent text-muted-foreground hover:text-destructive"
            )}
          >
            <AlertTriangle className="size-3.5" />
            Danger Zone
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-2">
          {/* General Tab */}
          {activeTab === "general" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-title" className="text-xs font-semibold">
                  Project Title
                </Label>
                <Input
                  id="proj-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={3}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-desc" className="text-xs font-semibold">
                  Description
                </Label>
                <Textarea
                  id="proj-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 size-4" />
                  )}
                  Save General Settings
                </Button>
              </div>
            </form>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Add Member Form */}
              <form onSubmit={handleAddMember} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter teammate's email address..."
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="pl-8 text-xs"
                    required
                  />
                </div>
                <Button type="submit" size="sm" disabled={isAddingMember}>
                  {isAddingMember ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="mr-1.5 size-4" /> Add
                    </>
                  )}
                </Button>
              </form>

              {/* Members List */}
              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {project.members.map((member) => {
                  const isOwner = member._id === project.owner._id;
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-2.5 text-xs bg-card"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {getInitials(member.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <span>{member.fullName || "User"}</span>
                            {isOwner && (
                              <Badge
                                variant="outline"
                                className="h-4 gap-1 px-1 text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              >
                                <Shield className="size-2.5" /> Owner
                              </Badge>
                            )}
                          </div>
                          <span className="text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </div>

                      {!isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMember(member._id)}
                          className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs">
              <div>
                <h4 className="font-semibold text-destructive text-sm">
                  Delete Project
                </h4>
                <p className="mt-1 text-muted-foreground">
                  Permanently remove this project board and all associated tasks.
                  This action cannot be undone.
                </p>
              </div>

              {!confirmDelete ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="mr-1.5 size-4" /> Delete Project...
                </Button>
              ) : (
                <div className="space-y-2 border-t border-destructive/20 pt-3">
                  <p className="font-medium text-destructive">
                    Are you absolutely sure you want to delete this project?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onDeleteProject}
                    >
                      Yes, Delete Permanently
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
