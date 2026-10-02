"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  createAdminSchema,
  type CreateAdminFormValues,
} from "@/lib/validators/admin.schema";
import { useCreateAdmin } from "@/hooks/use-admins";
import { useRolesList } from "@/hooks/use-roles";
import { ImageUpload } from "@/components/shared/ImageUpload";
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

export default function NewAdminPage() {
  const router = useRouter();
  const { mutate: createAdmin, isPending } = useCreateAdmin();
  const [image, setImage] = useState<File | null>(null);

  // Only roles with guard="admin" are valid for admin accounts
  const { data: adminRoles = [], isPending: rolesLoading } =
    useRolesList("admin");
  const roleOptions = adminRoles.map((r) => ({
    value: String(r.id),
    label: r.name,
  }));

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { name: "", email: "", password: "", role_id: undefined },
  });

  const onSubmit = (values: CreateAdminFormValues) => {
    createAdmin(
      { ...values, image },
      {
        onSuccess: () => router.push("/admins"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 409) {
              form.setError("email", {
                message:
                  typeof message === "string"
                    ? message
                    : "Email already exists",
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
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Admin</CardTitle>
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

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Profile image
                </span>
                <ImageUpload
                  onChange={(file) => {
                    setImage(file);
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane Smith"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="off"
                        placeholder="jane@school.com"
                        aria-invalid={!!form.formState.errors.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        aria-invalid={!!form.formState.errors.password}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <SimpleSelect
                        options={roleOptions}
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                        placeholder={
                          rolesLoading
                            ? "Loading roles…"
                            : roleOptions.length === 0
                              ? "No admin-guard roles available"
                              : "Select a role"
                        }
                        disabled={rolesLoading || roleOptions.length === 0}
                        aria-invalid={!!form.formState.errors.role_id}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Create admin"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admins")}
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
