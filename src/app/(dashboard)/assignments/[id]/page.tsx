"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import {
  useAssignment,
  useUpdateAssignment,
  useUpdateSubmission,
} from "@/hooks/use-assignments";
import { useRouteActions } from "@/hooks/use-sidebar";
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
import { Skeleton } from "@/components/ui/skeleton";
import type { Submission, SubmissionStatus } from "@/types/assignment";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
});
type FormValues = z.infer<typeof schema>;

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "late", label: "Late" },
  { value: "graded", label: "Graded" },
];

function errorText(err: unknown, fallback: string) {
  if (!isAxiosError(err)) return fallback;
  if (err.response?.status === 403) return "Insufficient permissions.";
  const message = err.response?.data?.message;
  return typeof message === "string" ? message : fallback;
}

function SubmissionRow({
  submission,
  assignmentId,
  canGrade,
}: {
  submission: Submission;
  assignmentId: string;
  canGrade: boolean;
}) {
  const { mutate: save, isPending } = useUpdateSubmission();
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [marks, setMarks] = useState(
    submission.marks_obtained === null ? "" : String(Number(submission.marks_obtained))
  );
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSave = () => {
    setMsg(null);
    const payload: { status: SubmissionStatus; marks_obtained?: number; feedback?: string } = {
      status,
      ...omitEmpty({ feedback }),
    };
    if (marks !== "") payload.marks_obtained = Number(marks);
    save(
      { submissionId: submission.id, assignmentId, payload },
      {
        onSuccess: () => setMsg({ ok: true, text: "Saved" }),
        onError: (err) => setMsg({ ok: false, text: errorText(err, "Could not save.") }),
      }
    );
  };

  return (
    <tr>
      <td className="px-4 py-2.5 text-muted-foreground">{submission.student?.roll_no}</td>
      <td className="px-4 py-2.5 text-foreground">{submission.student?.name}</td>
      <td className="px-4 py-2.5 w-36">
        <SimpleSelect
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={(v) => setStatus(v as SubmissionStatus)}
          disabled={!canGrade}
        />
      </td>
      <td className="px-4 py-2.5 w-24">
        <Input
          type="number"
          min={0}
          step="0.01"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          disabled={!canGrade}
          aria-label={`Marks for ${submission.student?.name}`}
        />
      </td>
      <td className="px-4 py-2.5">
        <Input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={!canGrade}
          aria-label={`Feedback for ${submission.student?.name}`}
        />
      </td>
      <td className="px-4 py-2.5 w-28 text-right">
        {canGrade && (
          <Button size="xs" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
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

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { actions } = useRouteActions("/assignments");
  const { data: assignment, isPending, isError } = useAssignment(id);
  const { mutate: updateAssignment, isPending: isSaving } = useUpdateAssignment();
  const [saved, setSaved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    // `values` re-syncs the form when the loaded assignment changes
    values: assignment
      ? {
          title: assignment.title,
          description: assignment.description ?? "",
          due_date: assignment.due_date,
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

  if (isError || !assignment) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive">Assignment not found.</p>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    setSaved(false);
    updateAssignment(
      { id, payload: { ...omitEmpty(values), title: values.title, due_date: values.due_date } },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => form.setError("root", { message: errorText(err, "An unexpected error occurred.") }),
      }
    );
  };

  const canGrade = !!actions.gradeSubmission;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {assignment.class_name ?? `Class #${assignment.class_id}`}
            {assignment.subject ? ` · ${assignment.subject.name}` : ""}
            {assignment.teacher_name ? ` · ${assignment.teacher_name}` : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/assignments")}>
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
                    Assignment updated.
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
          Submissions ({assignment.submissions_count})
        </h2>
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Roll No.</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Marks</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Feedback</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignment.submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No submissions: the class had no students when this assignment was created.
                  </td>
                </tr>
              ) : (
                assignment.submissions.map((s) => (
                  <SubmissionRow key={s.id} submission={s} assignmentId={id} canGrade={canGrade} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
