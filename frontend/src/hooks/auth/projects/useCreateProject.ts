import { createProject } from "@/api/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import axios from "axios";
import { queryKeys } from "@/lib/queryKeys";

export const useCreateProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      if (data?.project?._id) {
        navigate(`/projects/${data.project._id}`);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
