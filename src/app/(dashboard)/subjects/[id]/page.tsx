"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useSubject, useUpdateSubject } from "@/hooks/use-subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditSubjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: subject, isPending, isError } = useSubject(id);
  const { mutate: updateSubject, isPending: isSaving } = useUpdateSubject();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "" },
  });

  useEffect(() => {
    if (subject) form.reset({ name: subject.name, code: subject.code });
  }, [subject, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !subject) {
    return <div className="mx-auto max-w-lg py-8"><p className="text-sm text-destructive">Subject not found.</p></div>;
  }

  const onSubmit = (values: FormValues) => {
    updateSubject(
      { id, payload: values },
      {
        onSuccess: () => router.push("/subjects"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const message = err.response?.data?.message;
            form.setError("root", { message: typeof message === "string" ? message : "An unexpected error occurred." });
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader><CardTitle>Edit Subject</CardTitle></CardHeader>
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
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? "Saving…" : "Save changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/subjects")}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
