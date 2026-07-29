import { useGetProjects } from "@/hooks/auth/projects/useGetProjects";
import { ProjectCard } from "./ProjectCard";
import { Button } from "../ui/button";
import { EmptyProjects } from "./EmptyProjects";
import { ProjectsGridSkeleton } from "./ProjectsGridSkeleton";

export const ProjectsGrid = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    error,
  } = useGetProjects();
  const projects = data?.pages.flatMap((page) => page.projects) ?? [];

  if (isLoading) return <ProjectsGridSkeleton />;

  if (isError) {
    return <div className="text-destructive">{error.message}</div>;
  }

  if (!projects.length) {
    return <EmptyProjects />;
  }

  return (
    <div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
      {hasNextPage && (
        <Button
          className="mx-auto mt-8 block w-fit"
          variant="link"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load More ➜"}
        </Button>
      )}
    </div>
  );
};
