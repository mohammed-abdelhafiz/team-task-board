import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogsStore } from "@/store/dialogs.store";
import CreateProjectForm from "./CreateProjectForm";

export const CreateProjectDialog = () => {
  const { openCreateProjectDialog, setOpenCreateProjectDialog } =
    useDialogsStore();
  return (
    <Dialog
      open={openCreateProjectDialog}
      onOpenChange={setOpenCreateProjectDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to manage your team tasks.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm />
      </DialogContent>
    </Dialog>
  );
};
