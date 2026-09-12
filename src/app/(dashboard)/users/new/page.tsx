"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/lib/validators/user.schema";
import { useCreateUser } from "@/hooks/use-users";
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

export default function NewUserPage() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUser();
  const imageRef = useRef<File | null>(null);

  // Only roles with guard="user" are valid for user accounts
  const { data: userRoles = [], isPending: rolesLoading } =
    useRolesList("user");

  const roleOptions = userRoles.map((r) => ({
    value: String(r.id),
    label: r.name,
  }));

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role_id: 0,
    },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUser(
      { ...values, image: imageRef.current },
      {
        onSuccess: () => router.push("/users"),
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
          <CardTitle>New User</CardTitle>
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
                        placeholder="Ahmed Khan"
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
                        placeholder="ahmed@school.com"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+92-300-0000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="House 1, Street 1, City" {...field} />
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
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <SimpleSelect
                        options={roleOptions}
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                        placeholder={
                          rolesLoading
                            ? "Loading roles…"
                            : roleOptions.length === 0
                              ? "No user-guard roles available"
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
                  {isPending ? "Creating…" : "Create user"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/users")}
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
