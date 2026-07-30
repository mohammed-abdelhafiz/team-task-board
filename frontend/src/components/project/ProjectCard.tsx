import React from "react";
import { Link } from "react-router";
import type { Project } from "@/types/project";
import type { User } from "@/types/auth";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ArrowRight, FolderKanban, Shield, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { user } = useAuthStore();
  const isOwner = project.owner?._id === user?._id;

  const memberObjects: User[] = (project.members || []).filter(
    (m): m is User => typeof m === "object" && m !== null && "_id" in m
  );

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

  const ownerName = project.owner?.fullName || "Unknown Owner";

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            <FolderKanban className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <span className="text-xs text-muted-foreground">
              Created by {ownerName}
            </span>
          </div>
        </div>

        {isOwner ? (
          <Badge
            variant="outline"
            className="h-5 gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] font-semibold text-amber-600 dark:text-amber-400"
          >
            <Shield className="size-2.5" /> Owner
          </Badge>
        ) : (
          <Badge variant="secondary" className="h-5 text-[10px]">
            Member
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-5 py-2">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.25rem]">
          {project.description || "No project description provided."}
        </p>

        {/* Member Avatar Stack */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            <span>
              {(project.members || []).length}{" "}
              {(project.members || []).length === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="flex -space-x-1.5">
            {memberObjects.slice(0, 3).map((member) => (
              <Avatar key={member._id} size="sm" className="size-6 border border-background">
                <AvatarFallback className="bg-muted text-[9px] font-bold text-muted-foreground">
                  {getInitials(member.fullName)}
                </AvatarFallback>
              </Avatar>
            ))}
            {memberObjects.length > 3 && (
              <div className="flex size-6 items-center justify-center rounded-full bg-muted border border-background text-[9px] font-bold text-muted-foreground">
                +{memberObjects.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3">
        <Button variant="default" className="w-full gap-2 rounded-xl group/btn" render={<Link to={`/projects/${project._id}`} />}>
          <span>View Project Board</span>
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
