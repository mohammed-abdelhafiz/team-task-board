import { getProjects } from "@/api/project";
import { queryKeys } from "@/lib/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetProjects = (limit: number = 1) => {
  return useInfiniteQuery({
    queryKey: queryKeys.projects.all,
    queryFn: ({ pageParam = 1 }) => getProjects(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
