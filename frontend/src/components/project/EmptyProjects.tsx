import { Folder } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useDialogsStore } from "@/store/dialogs.store";

export function EmptyProjects() {
  const setOpenCreateProjectDialog = useDialogsStore(
    (state) => state.setOpenCreateProjectDialog,
  );
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setOpenCreateProjectDialog(true)}>
          Create Project
        </Button>
        <CreateProjectDialog />
      </EmptyContent>
    </Empty>
  );
}
