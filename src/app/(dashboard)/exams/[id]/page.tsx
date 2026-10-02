"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useExam, useUpdateExam, useUpdateResult } from "@/hooks/use-exams";
import { useRouteActions } from "@/hooks/use-sidebar";
import { omitEmpty } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { EXAM_TYPES, type ExamResult, type ExamType } from "@/types/exam";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  total_marks: z.string().refine((v) => Number(v) > 0, "Total marks must be greater than 0"),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function errorText(err: unknown, fallback: string) {
  if (!isAxiosError(err)) return fallback;
  if (err.response?.status === 403) return "Insufficient permissions.";
  const message = err.response?.data?.message;
  return typeof message === "string" ? message : fallback;
}

function ResultRow({
  result,
  examId,
  total,
  canEnter,
}: {
  result: ExamResult;
  examId: string;
  total: number;
  canEnter: boolean;
}) {
  const { mutate: save, isPending } = useUpdateResult();
  const [marks, setMarks] = useState(
    result.marks_obtained === null ? "" : String(Number(result.marks_obtained))
  );
  const [remarks, setRemarks] = useState(result.remarks ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const done = (text: string) => ({
    onSuccess: () => setMsg({ ok: true, text }),
    onError: (err: unknown) => setMsg({ ok: false, text: errorText(err, "Could not save.") }),
  });

  const handleSave = () => {
    setMsg(null);
    if (marks === "") {
      setMsg({ ok: false, text: "Enter marks, or mark the student absent." });
      return;
    }
    const value = Number(marks);
    if (value < 0 || value > total) {
      setMsg({ ok: false, text: `Marks must be between 0 and ${total}.` });
      return;
    }
    save(
      { resultId: result.id, examId, payload: { marks_obtained: value, ...omitEmpty({ remarks }) } },
      done("Saved")
    );
  };

  const handleAbsent = () => {
    setMsg(null);
    setMarks("");
    save({ resultId: result.id, examId, payload: { status: "absent" } }, done("Marked absent"));
  };

  return (
    <tr>
      <td className="px-4 py-2.5 text-muted-foreground">{result.student?.roll_no}</td>
      <td className="px-4 py-2.5 text-foreground">{result.student?.name}</td>
      <td className="px-4 py-2.5 w-28">
        <Input
          type="number"
          min={0}
          max={total}
          step="0.01"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          disabled={!canEnter}
          aria-label={`Marks for ${result.student?.name}`}
        />
      </td>
      <td className="px-4 py-2.5 text-muted-foreground w-20">
        {result.percentage === null ? "—" : `${Number(result.percentage)}%`}
      </td>
      <td className="px-4 py-2.5 w-24">
        <StatusBadge status={result.status} />
      </td>
      <td className="px-4 py-2.5">
        <Input
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          disabled={!canEnter}
          aria-label={`Remarks for ${result.student?.name}`}
        />
      </td>
      <td className="px-4 py-2.5 w-36 text-right">
        {canEnter && (
          <div className="flex justify-end gap-1.5">
            <Button size="xs" onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
            <Button size="xs" variant="outline" onClick={handleAbsent} disabled={isPending}>
              Absent
            </Button>
          </div>
        )}
        {msg && (
          <p
            role={msg.ok ? "status" : "alert"}
            className={`mt-1 text-xs ${msg.ok ? "text-success" : "text-destructive"}`}
          >
            {msg.text}
          </p>
        )}
      </td>
    </tr>
  );
}

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { actions } = useRouteActions("/exams");
  const { data: exam, isPending, isError } = useExam(id);
  const { mutate: updateExam, isPending: isSaving } = useUpdateExam();
  const [saved, setSaved] = useState(false);
  const [examType, setExamType] = useState<ExamType | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    // `values` re-syncs the form when the loaded exam changes
    values: exam
      ? {
          title: exam.title,
          exam_date: exam.exam_date,
          start_time: exam.start_time ?? "",
          end_time: exam.end_time ?? "",
          total_marks: String(Number(exam.total_marks)),
          description: exam.description ?? "",
        }
      : undefined,
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive">Exam not found.</p>
      </div>
    );
  }

  const total = Number(exam.total_marks);
  const currentType = examType ?? exam.exam_type;

  const onSubmit = (values: FormValues) => {
    setSaved(false);
    updateExam(
      {
        id,
        payload: {
          ...omitEmpty(values),
          title: values.title,
          exam_date: values.exam_date,
          total_marks: Number(values.total_marks),
          exam_type: currentType,
        },
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) =>
          form.setError("root", { message: errorText(err, "An unexpected error occurred.") }),
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{exam.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {exam.class_name ?? `Class #${exam.class_id}`}
            {exam.subject_name ? ` · ${exam.subject_name}` : ""} · out of {total}. Pass mark is 40%
            (set by the server).
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/exams")}>
          Back
        </Button>
      </div>

      {actions.update && (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-4"
              >
                {form.formState.errors.root && (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {form.formState.errors.root.message}
                  </div>
                )}
                {saved && (
                  <div role="status" className="text-sm text-success">
                    Exam updated. Changing total marks recomputes entered results.
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
                    value={currentType}
                    onValueChange={(v) => setExamType(v as ExamType)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="exam_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start</FormLabel>
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
                        <FormLabel>End</FormLabel>
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Results ({exam.results_count})
        </h2>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Roll No.</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Marks</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">%</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Remarks</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exam.results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results: the class had no students when this exam was created.
                  </td>
                </tr>
              ) : (
                exam.results.map((r) => (
                  <ResultRow
                    key={`${r.id}-${r.marks_obtained}-${r.status}`}
                    result={r}
                    examId={id}
                    total={total}
                    canEnter={!!actions.updateResult}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
