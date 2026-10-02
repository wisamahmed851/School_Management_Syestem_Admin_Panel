"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateGuardian } from "@/hooks/use-guardians";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  relation_to_student: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewGuardianPage() {
  const router = useRouter();
  const { mutate: createGuardian, isPending } = useCreateGuardian();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", password: "", phone: "", email: "", relation_to_student: "" },
  });

  const onSubmit = (values: FormValues) => {
    const payload = { ...values, email: values.email || undefined };
    createGuardian(payload, {
      onSuccess: () => router.push("/guardians"),
      onError: (err) => {
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const message = err.response?.data?.message;
          if (status === 409) {
            form.setError("email", { message: typeof message === "string" ? message : "Email already exists" });
          } else if (status === 403) {
            form.setError("root", { message: "Insufficient permissions." });
          } else if (status === 404) {
            form.setError("root", { message: typeof message === "string" ? message : "Required role not found." });
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
        <CardHeader><CardTitle>New Guardian</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {form.formState.errors.root && (
                <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Mrs. Fatima" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone <span className="text-muted-foreground">(optional)</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email <span className="text-muted-foreground">(optional)</span></FormLabel><FormControl><Input type="email" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="relation_to_student" render={({ field }) => (
                <FormItem><FormLabel>Relation <span className="text-muted-foreground">(optional)</span></FormLabel><FormControl><Input placeholder="e.g. mother" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">{isPending ? "Creating…" : "Create guardian"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/guardians")}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
