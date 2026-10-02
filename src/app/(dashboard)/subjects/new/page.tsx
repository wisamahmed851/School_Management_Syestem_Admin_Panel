"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateSubject } from "@/hooks/use-subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});
type FormValues = z.infer<typeof schema>;

export default function NewSubjectPage() {
  const router = useRouter();
  const { mutate: createSubject, isPending } = useCreateSubject();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "" },
  });

  const onSubmit = (values: FormValues) => {
    createSubject(values, {
      onSuccess: () => router.push("/subjects"),
      onError: (err) => {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const message = err.response?.data?.message;
          if (status === 409) {
            form.setError("code", { message: typeof message === "string" ? message : "Subject code already exists" });
          } else if (status === 403) {
            form.setError("root", { message: "Insufficient permissions." });
          } else {
            form.setError("root", { message: typeof message === "string" ? message : "An unexpected error occurred." });
          }
        }
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader><CardTitle>New Subject</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {form.formState.errors.root && (
                <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="MATH-101" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">{isPending ? "Creating…" : "Create subject"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/subjects")}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
