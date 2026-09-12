"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  createPermissionSchema,
  type CreatePermissionFormValues,
} from "@/lib/validators/permission.schema";
import { usePermission, useUpdatePermission } from "@/hooks/use-permissions";
import { GUARD_OPTIONS } from "@/lib/constants/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleSelect } from "@/components/ui/select";

export default function EditPermissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: permission, isPending, isError } = usePermission(id);
  const { mutate: updatePermission, isPending: isSaving } =
    useUpdatePermission();

  const form = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: { module: "", action: "", name: "", guard: "admin" },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        module: permission.module,
        action: permission.action,
        name: permission.name,
        guard: permission.guard as "admin" | "user",
      });
    }
  }, [permission, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !permission) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Permission not found.</p>
      </div>
    );
  }

  const onSubmit = (values: CreatePermissionFormValues) => {
    updatePermission(
      { id, payload: values },
      {
        onSuccess: () => router.push("/permissions"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Permission not found." });
            } else {
              form.setError("root", {
                message:
                  typeof message === "string"
                    ? message
                    : "An unexpected error occurred.",
              });
            }
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {form.formState.errors.root && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {form.formState.errors.root.message}
                </div>
              )}

              {(["module", "action", "name"] as const).map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{fieldName}</FormLabel>
                      <FormControl>
                        <Input
                          aria-invalid={!!form.formState.errors[fieldName]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="guard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guard</FormLabel>
                    <FormControl>
                      <SimpleSelect
                        options={GUARD_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={!!form.formState.errors.guard}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/permissions")}
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
