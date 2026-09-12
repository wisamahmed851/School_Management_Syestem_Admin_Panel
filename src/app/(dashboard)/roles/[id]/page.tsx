"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/lib/validators/role.schema";
import { useRole, useUpdateRole } from "@/hooks/use-roles";
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

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: role, isPending, isError } = useRole(id);
  const { mutate: updateRole, isPending: isSaving } = useUpdateRole();

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", guard: "admin" },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        guard: role.guard as "admin" | "user",
      });
    }
  }, [role, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Role not found.</p>
      </div>
    );
  }

  const onSubmit = (values: CreateRoleFormValues) => {
    updateRole(
      { id, payload: values },
      {
        onSuccess: () => router.push("/roles"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Role not found." });
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
          <CardTitle>Edit Role</CardTitle>
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!form.formState.errors.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  onClick={() => router.push("/roles")}
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
