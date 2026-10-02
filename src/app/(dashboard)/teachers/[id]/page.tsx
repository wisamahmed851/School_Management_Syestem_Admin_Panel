"use client";

import { omitEmpty } from "@/lib/utils";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useTeacher, useUpdateTeacher } from "@/hooks/use-teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email").optional(),
  phone: z.string().optional(),
  subject_specialization: z.string().optional(),
  joining_date: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditTeacherPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: teacher, isPending, isError } = useTeacher(id);
  const { mutate: updateTeacher, isPending: isSaving } = useUpdateTeacher();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject_specialization: "",
      joining_date: "",
    },
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone ?? "",
        subject_specialization: teacher.subject_specialization ?? "",
        joining_date: teacher.joining_date ?? "",
      });
    }
  }, [teacher, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Teacher not found.</p>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    updateTeacher(
      { id, payload: omitEmpty(values) },
      {
        onSuccess: () => router.push("/teachers"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Teacher not found." });
            } else {
              form.setError("root", {
                message: typeof message === "string" ? message : "An unexpected error occurred.",
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
        <CardHeader><CardTitle>Edit Teacher</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {form.formState.errors.root && (
                <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="subject_specialization" render={({ field }) => (
                <FormItem><FormLabel>Subject specialization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="joining_date" render={({ field }) => (
                <FormItem><FormLabel>Joining date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving…" : "Save changes"}
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
