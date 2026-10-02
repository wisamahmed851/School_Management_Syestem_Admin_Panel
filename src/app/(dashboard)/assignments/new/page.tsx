"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { useClassesList } from "@/hooks/use-classes";
import { useClassSubjectsByClass } from "@/hooks/use-class-subjects";
import { omitEmpty } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SimpleSelect } from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
});
type FormValues = z.infer<typeof schema>;

export default function NewAssignmentPage() {
  const router = useRouter();
  const { mutate: createAssignment, isPending } = useCreateAssignment();
  const { data: classes = [], isPending: classesPending } = useClassesList();

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [fkError, setFkError] = useState<string | null>(null);
  // Only subjects mapped to the chosen class are valid (backend rule)
  const { data: mappings = [], isPending: mappingsPending } = useClassSubjectsByClass(
    classId || undefined
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", due_date: "" },
  });

  const onSubmit = (values: FormValues) => {
    setFkError(null);
    if (!classId) {
      setFkError("Please select a class.");
      return;
    }
    createAssignment(
      {
        ...omitEmpty(values),
        title: values.title,
        due_date: values.due_date,
        class_id: Number(classId),
        ...(subjectId ? { subject_id: Number(subjectId) } : {}),
      },
      {
        onSuccess: () => router.push("/assignments"),
        onError: (err) => {
          const status = isAxiosError(err) ? err.response?.status : undefined;
          const message = isAxiosError(err) ? err.response?.data?.message : undefined;
          form.setError("root", {
            message:
              status === 403
                ? "Insufficient permissions."
                : typeof message === "string"
                  ? message
                  : "An unexpected error occurred.",
          });
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {(form.formState.errors.root || fkError) && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {form.formState.errors.root?.message ?? fkError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Class</span>
                <SimpleSelect
                  options={classes.map((c) => ({
                    value: String(c.id),
                    label: c.section ? `${c.name} (${c.section})` : c.name,
                  }))}
                  value={classId}
                  onValueChange={(v) => {
                    setClassId(v);
                    setSubjectId("");
                  }}
                  placeholder={classesPending ? "Loading classes…" : "Select a class"}
                  disabled={classesPending}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Subject <span className="text-muted-foreground">(optional)</span>
                </span>
                <SimpleSelect
                  options={mappings.map((m) => ({
                    value: String(m.subject_id),
                    label: m.subject_name ?? `#${m.subject_id}`,
                  }))}
                  value={subjectId}
                  onValueChange={setSubjectId}
                  placeholder={
                    !classId
                      ? "Select a class first"
                      : mappingsPending
                        ? "Loading subjects…"
                        : mappings.length === 0
                          ? "No subjects mapped to this class"
                          : "Select a subject"
                  }
                  disabled={!classId || mappingsPending || mappings.length === 0}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Create assignment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/assignments")}
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
