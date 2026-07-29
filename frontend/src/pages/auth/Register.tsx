import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schema/auth.schema";
import type { RegisterDto } from "@/schema/auth.schema";
import { Link } from "react-router";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterPage() {
  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegister();

  function onSubmit(data: RegisterDto) {
    registerMutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Register an account to start using the task board.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-fullName">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-form-fullName"
                    aria-invalid={fieldState.invalid}
                    placeholder="eg. Mohamed Abdelhafiz"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="eg. mo@gmail.com"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <Button
            type="submit"
            form="register-form"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating your account..."
              : "Register"}
          </Button>
          <p className="flex items-center justify-center gap-2 text-sm">
            Already have an account?
            <Link to="/login" className="hover:underline text-primary">
              Login
            </Link>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
}
