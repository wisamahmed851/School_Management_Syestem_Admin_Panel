"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateExam } from "@/hooks/use-exams";
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
import { Button } from "@/components/ui/button";
import { SimpleSelect } from "@/components/ui/select";
import { EXAM_TYPES, type ExamType } from "@/types/exam";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  total_marks: z.string().refine((v) => Number(v) > 0, "Total marks must be greater than 0"),
});
type FormValues = z.infer<typeof schema>;

export default function NewExamPage() {
  const router = useRouter();
  const { mutate: createExam, isPending } = useCreateExam();
  const { data: classes = [], isPending: classesPending } = useClassesList();

  const [examType, setExamType] = useState<ExamType | "">("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [fkError, setFkError] = useState<string | null>(null);
  const { data: mappings = [], isPending: mappingsPending } = useClassSubjectsByClass(
    classId || undefined
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", exam_date: "", start_time: "", end_time: "", total_marks: "" },
  });

  const onSubmit = (values: FormValues) => {
    setFkError(null);
    if (!examType) return setFkError("Please select an exam type.");
    if (!classId) return setFkError("Please select a class.");

    createExam(
      {
        ...omitEmpty(values),
        title: values.title,
        exam_date: values.exam_date,
        total_marks: Number(values.total_marks),
        exam_type: examType,
        class_id: Number(classId),
        ...(subjectId ? { subject_id: Number(subjectId) } : {}),
      },
      {
        onSuccess: () => router.push("/exams"),
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
          <CardTitle>New Exam</CardTitle>
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

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Type</span>
                <SimpleSelect
                  options={EXAM_TYPES}
                  value={examType}
                  onValueChange={(v) => setExamType(v as ExamType)}
                  placeholder="Select a type"
                />
              </div>

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
                name="exam_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Start <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        End <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="total_marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total marks</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Create exam"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/exams")}>
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
