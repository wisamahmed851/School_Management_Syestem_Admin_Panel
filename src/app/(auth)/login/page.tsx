"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validators/login.schema";
import { useLogin } from "@/hooks/use-login";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const responseData = error.response?.data;

          if (status === 401) {
            form.setError("root", {
              message: "Invalid email or password",
            });
          } else if (status === 400) {
            const messages = responseData?.message;
            if (Array.isArray(messages)) {
              messages.forEach(
                (err: { field?: string; message?: string } | string) => {
                  if (typeof err === "object" && err.field) {
                    const field = err.field as keyof LoginFormValues;
                    form.setError(field, {
                      message: err.message ?? "Invalid value",
                    });
                  }
                }
              );
            } else {
              form.setError("root", {
                message:
                  typeof messages === "string"
                    ? messages
                    : "Validation failed",
              });
            }
          } else {
            form.setError("root", {
              message: "An unexpected error occurred. Please try again.",
            });
          }
        }
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <CardDescription>School Management System</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Root / server error */}
              {form.formState.errors.root && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="admin@school.com"
                        aria-invalid={!!form.formState.errors.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        aria-invalid={!!form.formState.errors.password}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                size="lg"
              >
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
