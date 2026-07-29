import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { ProjectsGrid } from "@/components/project/ProjectsGrid";
import { Button } from "@/components/ui/button";
import { useDialogsStore } from "@/store/dialogs.store";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const setOpenCreateProjectDialog = useDialogsStore(
    (state) => state.setOpenCreateProjectDialog,
  );
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase">Your projects</h1>
        <Button
          size="lg"
          className="flex items-center"
          onClick={() => setOpenCreateProjectDialog(true)}
        >
          <PlusCircle className="mr-1" />
          Create Project
        </Button>
        <CreateProjectDialog />
      </div>
      <ProjectsGrid />
    </div>
  );
}
