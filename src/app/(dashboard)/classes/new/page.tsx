"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateClass } from "@/hooks/use-classes";
import { useTeachersList } from "@/hooks/use-teachers";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  section: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewClassPage() {
  const router = useRouter();
  const { mutate: createClass, isPending } = useCreateClass();

  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const { data: teachers = [], isPending: teachersLoading } = useTeachersList(teacherSearch || undefined);

  const teacherOptions = teachers.map((t) => ({
    id: t.id,
    label: t.name,
    sublabel: t.subject_specialization ?? t.email,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", section: "" },
  });

  const onSubmit = (values: FormValues) => {
    createClass(
      { ...values, class_teacher_id: teacherId ?? undefined },
      {
        onSuccess: () => router.push("/classes"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 409) {
              form.setError("name", { message: typeof message === "string" ? message : "Class already exists" });
            } else if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else {
              form.setError("root", { message: typeof message === "string" ? message : "An unexpected error occurred." });
            }
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader><CardTitle>New Class</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {form.formState.errors.root && (
                <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Class name</FormLabel><FormControl><Input placeholder="Grade 5 - A" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="section" render={({ field }) => (
                <FormItem>
                  <FormLabel>Section <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="A" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Class teacher <span className="text-muted-foreground">(optional)</span>
                </span>
                <SearchableSelect
                  value={teacherId}
                  onChange={setTeacherId}
                  onSearch={setTeacherSearch}
                  options={teacherOptions}
                  isLoading={teachersLoading}
                  placeholder="Search and select a teacher"
                  emptyMessage="No teachers found."
                  clearable
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">{isPending ? "Creating…" : "Create class"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/classes")}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
