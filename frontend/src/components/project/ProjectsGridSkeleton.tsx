import { Skeleton } from "../ui/skeleton";

export const ProjectsGridSkeleton = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton className="h-40 w-full" key={index} />
      ))}
    </div>
  );
};
