"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validators/change-password.schema";
import { useChangePassword } from "@/hooks/use-change-password";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

export default function ChangePasswordPage() {
  const router = useRouter();
  const { mutate: changePassword, isPending } = useChangePassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    setSuccessMessage(null);

    changePassword(values, {
      onSuccess: (data) => {
        setSuccessMessage(data.message ?? "Password changed successfully.");
        form.reset();
        // Give the user a moment to see the success message, then go back.
        setTimeout(() => router.push("/profile"), 1500);
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const message = error.response?.data?.message;

          if (status === 400) {
            // Per API docs section 1.3: 400 means "Old password is incorrect".
            // Show it as a field-level error on oldPassword, not a generic alert.
            form.setError("oldPassword", {
              message:
                typeof message === "string"
                  ? message
                  : "Old password is incorrect",
            });
          } else {
            // 401 is handled globally by client.ts interceptor.
            // Anything else surfaces as a root error.
            form.setError("root", {
              message:
                typeof message === "string"
                  ? message
                  : "An unexpected error occurred. Please try again.",
            });
          }
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new one.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Success message */}
              {successMessage && (
                <div
                  role="status"
                  className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
                >
                  {successMessage}
                </div>
              )}

              {/* Root / unexpected error */}
              {form.formState.errors.root && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Current password */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        aria-invalid={!!form.formState.errors.oldPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        aria-invalid={!!form.formState.errors.newPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? "Saving…" : "Save new password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => router.push("/profile")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
