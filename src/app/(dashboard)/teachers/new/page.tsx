"use client";

import { omitEmpty } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateTeacher } from "@/hooks/use-teachers";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().optional(),
  subject_specialization: z.string().optional(),
  joining_date: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewTeacherPage() {
  const router = useRouter();
  const { mutate: createTeacher, isPending } = useCreateTeacher();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      subject_specialization: "",
      joining_date: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createTeacher(omitEmpty(values) as typeof values, {
      onSuccess: () => router.push("/teachers"),
      onError: (err) => {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const message = err.response?.data?.message;
          if (status === 409) {
            form.setError("email", {
              message:
                typeof message === "string" ? message : "Email already exists",
            });
          } else if (status === 403) {
            form.setError("root", { message: "Insufficient permissions." });
          } else if (status === 404) {
            form.setError("root", {
              message:
                typeof message === "string"
                  ? message
                  : "Required role not found — ensure the 'teacher' role exists.",
            });
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
          <CardTitle>New Teacher</CardTitle>
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

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Mr. Ahmed" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" autoComplete="off" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="subject_specialization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject specialization <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Mathematics" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="joining_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining date <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Create teacher"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/teachers")}>
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
