import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { ProjectsGrid } from "@/components/project/ProjectsGrid";
import { Button } from "@/components/ui/button";
import { useDialogsStore } from "@/store/dialogs.store";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const setOpenCreateProjectDialog = useDialogsStore(
    (state) => state.setOpenCreateProjectDialog
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects Overview
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your team's project boards, track progress, and collaborate seamlessly.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 font-semibold shadow-xs self-start sm:self-auto"
          onClick={() => setOpenCreateProjectDialog(true)}
        >
          <Plus className="size-4" />
          Create Project
        </Button>
        <CreateProjectDialog />
      </div>

      <ProjectsGrid />
    </div>
  );
}
