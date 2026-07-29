import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createProjectSchema,
  type CreateProjectDto,
} from "@/schema/project.schema";
import { useCreateProject } from "@/hooks/auth/projects/useCreateProject";
import { Textarea } from "../ui/textarea";
import { useDialogsStore } from "@/store/dialogs.store";

export default function CreateProjectForm() {
  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const { setOpenCreateProjectDialog } = useDialogsStore();
  const createProjectMutation = useCreateProject();

  async function onSubmit(data: CreateProjectDto) {
      await createProjectMutation.mutateAsync(data);
      setOpenCreateProjectDialog(false);
  }

  return (
    <form id="create-project-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-project-form-title">Title</FieldLabel>
              <Input
                {...field}
                id="create-project-form-title"
                aria-invalid={fieldState.invalid}
                placeholder="eg. Project title"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-project-form-description">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="create-project-form-description"
                aria-invalid={fieldState.invalid}
                placeholder="Project description"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending
              ? "Creating project..."
              : "Create project"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
