"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  updateAdminSchema,
  type UpdateAdminFormValues,
} from "@/lib/validators/admin.schema";
import { useAdmin, useUpdateAdmin } from "@/hooks/use-admins";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleSelect } from "@/components/ui/select";

export default function EditAdminPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: admin, isPending, isError } = useAdmin(id);
  const { mutate: updateAdmin, isPending: isSaving } = useUpdateAdmin();
  const imageRef = useRef<File | null>(null);

  // Only admin-guard roles for admin accounts
  const { data: adminRoles = [], isPending: rolesLoading } =
    useRolesList("admin");
  const roleOptions = adminRoles.map((r) => ({
    value: String(r.id),
    label: r.name,
  }));

  const form = useForm<UpdateAdminFormValues>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: { name: "", email: "", password: "", role_id: undefined },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        password: "",
        role_id: undefined,
      });
    }
  }, [admin, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Admin not found.</p>
      </div>
    );
  }

  const onSubmit = (values: UpdateAdminFormValues) => {
    // Don't send password if left blank
    const payload: UpdateAdminFormValues & { image?: File | null } = {
      ...values,
      image: imageRef.current,
    };
    if (!payload.password) delete payload.password;
    // role_id is optional on update — only send if the user picked a new one
    if (!payload.role_id) delete payload.role_id;

    updateAdmin(
      { id, payload },
      {
        onSuccess: () => router.push("/admins"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Admin not found." });
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
          <CardTitle>Edit Admin</CardTitle>
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
                  value={admin.image ?? undefined}
                  onChange={(file) => {
                    imageRef.current = file;
                  }}
                />
              </div>

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                    <FormLabel>
                      New password{" "}
                      <span className="text-muted-foreground">
                        (leave blank to keep current)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
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
                      <span className="text-muted-foreground">
                        (optional — leave unchanged if not reassigning)
                      </span>
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
                              : "Select a role to reassign"
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
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving…" : "Save changes"}
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
