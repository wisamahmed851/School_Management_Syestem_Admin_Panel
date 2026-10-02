"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useClassesList } from "@/hooks/use-classes";
import { useStudentsList } from "@/hooks/use-students";
import { useAttendanceByClass, useMarkAttendance } from "@/hooks/use-attendance";
import { useRouteActions } from "@/hooks/use-sidebar";
import { SimpleSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttendanceStatus } from "@/types/attendance";

const STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
];

const todayIso = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

export default function AttendancePage() {
  const { actions } = useRouteActions("/attendance");
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(todayIso);
  // Unsaved changes on top of what the server already has; reset when class/date change
  const [edits, setEdits] = useState<Record<number, AttendanceStatus>>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const { data: classes = [], isPending: classesPending } = useClassesList();
  const { data: students = [], isPending: studentsPending } = useStudentsList();
  const { data: saved, isPending: savedPending, isError } = useAttendanceByClass(
    classId || undefined,
    date
  );
  const { mutate: mark, isPending: isSaving } = useMarkAttendance();

  const roster = students.filter(
    (s) => String(s.class_id) === classId && s.status === 1
  );
  const savedByStudent = new Map((saved?.records ?? []).map((r) => [r.student_id, r]));
  const statusOf = (studentId: number): AttendanceStatus =>
    edits[studentId] ?? savedByStudent.get(studentId)?.status ?? "present";

  const classOptions = classes.map((c) => ({
    value: String(c.id),
    label: c.section ? `${c.name} (${c.section})` : c.name,
  }));

  const resetView = () => {
    setEdits({});
    setMessage(null);
  };

  const setAll = (status: AttendanceStatus) =>
    setEdits(Object.fromEntries(roster.map((s) => [s.id, status])));

  const handleSave = () => {
    setMessage(null);
    mark(
      {
        class_id: Number(classId),
        date,
        records: roster.map((s) => ({ student_id: s.id, status: statusOf(s.id) })),
      },
      {
        onSuccess: (res) => {
          setEdits({});
          setMessage({ ok: true, text: res.message });
        },
        onError: (err) => {
          const status = isAxiosError(err) ? err.response?.status : undefined;
          const serverMsg = isAxiosError(err) ? err.response?.data?.message : undefined;
          setMessage({
            ok: false,
            text:
              status === 403
                ? "Insufficient permissions."
                : typeof serverMsg === "string"
                  ? serverMsg
                  : "Could not save attendance.",
          });
        },
      }
    );
  };

  const isLoading = studentsPending || (!!classId && savedPending);
  const canMark = !!actions.mark;
  const unsaved = Object.keys(edits).length > 0;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pick a class and date, set each student&apos;s status, then save. Saving again for the
          same date corrects earlier entries.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 w-64">
          <span className="text-sm font-medium text-foreground">Class</span>
          <SimpleSelect
            options={classOptions}
            value={classId}
            onValueChange={(v) => {
              setClassId(v);
              resetView();
            }}
            placeholder={classesPending ? "Loading classes…" : "Select a class"}
            disabled={classesPending}
          />
        </div>
        <div className="flex flex-col gap-1.5 w-44">
          <label htmlFor="att-date" className="text-sm font-medium text-foreground">
            Date
          </label>
          <Input
            id="att-date"
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => {
              setDate(e.target.value);
              resetView();
            }}
          />
        </div>
      </div>

      {message && (
        <div
          role={message.ok ? "status" : "alert"}
          className={
            message.ok
              ? "rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
              : "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          }
        >
          {message.text}
        </div>
      )}

      {!classId ? (
        <p className="text-sm text-muted-foreground">Select a class to see its students.</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Could not load attendance for this class.</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${roster.length} student(s) · ${saved?.total ?? 0} already marked`}
            </p>
            {canMark && roster.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setAll("present")}>
                Mark all present
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground w-24">
                    Roll No.
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={3} className="px-4 py-2.5">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : roster.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No active students in this class.
                    </td>
                  </tr>
                ) : (
                  roster.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.roll_no}</td>
                      <td className="px-4 py-2.5 text-foreground">{s.name}</td>
                      <td className="px-4 py-2.5">
                        <div
                          className="flex gap-1.5"
                          role="group"
                          aria-label={`Status for ${s.name}`}
                        >
                          {STATUSES.map((st) => (
                            <Button
                              key={st.value}
                              size="xs"
                              variant={statusOf(s.id) === st.value ? "default" : "outline"}
                              aria-pressed={statusOf(s.id) === st.value}
                              disabled={!canMark}
                              onClick={() => setEdits((e) => ({ ...e, [s.id]: st.value }))}
                            >
                              {st.label}
                            </Button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {canMark && roster.length > 0 && (
            <div className="flex items-center justify-end gap-3">
              {unsaved && (
                <span className="text-xs text-muted-foreground">Unsaved changes</span>
              )}
              <Button onClick={handleSave} disabled={isSaving || isLoading}>
                {isSaving ? "Saving…" : "Save attendance"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
