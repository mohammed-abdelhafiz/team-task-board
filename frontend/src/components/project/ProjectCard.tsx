import type { Project } from "@/types/project";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router";
import { useAuthStore } from "@/store/auth.store";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { user } = useAuthStore();
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <Badge variant="secondary">
          {project.members.length}{" "}
          {project.members.length > 1 ? "members" : "member"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          {project.description || "No description available"}
        </p>
        <Badge variant="outline">{project.owner._id === user._id?"Owner":"Member"}</Badge>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full">
          <Link to={`/projects/${project._id}`} className="w-full">
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
