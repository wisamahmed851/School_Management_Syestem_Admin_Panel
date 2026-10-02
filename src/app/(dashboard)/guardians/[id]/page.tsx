"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useGuardian, useUpdateGuardian } from "@/hooks/use-guardians";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  relation_to_student: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditGuardianPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: guardian, isPending, isError } = useGuardian(id);
  const { mutate: updateGuardian, isPending: isSaving } = useUpdateGuardian();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", relation_to_student: "" },
  });

  useEffect(() => {
    if (guardian) {
      form.reset({
        name: guardian.name,
        phone: guardian.phone ?? "",
        email: guardian.email ?? "",
        relation_to_student: guardian.relation_to_student ?? "",
      });
    }
  }, [guardian, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  if (isError || !guardian) {
    return <div className="mx-auto max-w-lg py-8"><p className="text-sm text-destructive">Guardian not found.</p></div>;
  }

  const onSubmit = (values: FormValues) => {
    const payload = { ...values, email: values.email || undefined };
    updateGuardian(
      { id, payload },
      {
        onSuccess: () => router.push("/guardians"),
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
        <CardHeader><CardTitle>Edit Guardian</CardTitle></CardHeader>
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
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="relation_to_student" render={({ field }) => (
                <FormItem><FormLabel>Relation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">{isSaving ? "Saving…" : "Save changes"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/guardians")}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
