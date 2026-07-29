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
import { loginSchema, type LoginDto } from "@/schema/auth.schema";
import { Link } from "react-router";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginPage() {
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  function onSubmit(data: LoginDto) {
    loginMutation.mutate(data);
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-form-email"
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
                    <FieldLabel htmlFor="login-form-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-form-password"
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
              form="login-form"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <p className="flex items-center justify-center gap-2 text-sm">
              Don't have an account?
              <Link to="/register" className="hover:underline text-primary">
                Register
              </Link>
            </p>
          </Field>
        </CardFooter>
      </Card>
  );
}
