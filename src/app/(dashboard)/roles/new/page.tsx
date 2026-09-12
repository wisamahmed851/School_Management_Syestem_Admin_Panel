"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/lib/validators/role.schema";
import { useCreateRole } from "@/hooks/use-roles";
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
import { SimpleSelect } from "@/components/ui/select";

export default function NewRolePage() {
  const router = useRouter();
  const { mutate: createRole, isPending } = useCreateRole();

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", guard: "admin" },
  });

  const onSubmit = (values: CreateRoleFormValues) => {
    createRole(values, {
      onSuccess: () => router.push("/roles"),
      onError: (err) => {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const message = err.response?.data?.message;
          if (status === 409) {
            form.setError("name", {
              message:
                typeof message === "string" ? message : "Role already exists",
            });
          } else if (status === 403) {
            form.setError("root", { message: "Insufficient permissions." });
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
    });
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Role</CardTitle>
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
                        placeholder="e.g. teacher"
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
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Create role"}
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
