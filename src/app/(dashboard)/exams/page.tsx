"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useExamsList, useDeleteExam, useToggleExamStatus } from "@/hooks/use-exams";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { EXAM_TYPES, type Exam } from "@/types/exam";

const typeLabel = (t: string) => EXAM_TYPES.find((x) => x.value === t)?.label ?? t;

export default function ExamsPage() {
  const { data: exams = [], isPending } = useExamsList();
  const { mutate: deleteExam, isPending: isDeleting } = useDeleteExam();
  const { mutate: toggleStatus } = useToggleExamStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);
  const { actions } = useRouteActions("/exams");

  const onError = (err: unknown) => {
    if (isAxiosError(err) && err.response?.status === 403)
      setForbiddenMsg("Insufficient permissions.");
  };

  const columns: ColumnDef<Exam>[] = [
    { key: "title", header: "Title", cell: (r) => r.title },
    { key: "type", header: "Type", cell: (r) => typeLabel(r.exam_type) },
    { key: "class", header: "Class", cell: (r) => r.class_name ?? `#${r.class_id}` },
    { key: "subject", header: "Subject", cell: (r) => r.subject_name ?? "—" },
    { key: "date", header: "Date", cell: (r) => r.exam_date },
    { key: "total", header: "Total", cell: (r) => Number(r.total_marks) },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status === 1 ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-56 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {actions.toggleStatus && (
            <Button size="xs" variant="outline" onClick={() => toggleStatus(r.id, { onError })}>
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {(actions.findOne || actions.update || actions.updateResult) && (
            <Button size="xs" variant="outline" render={<Link href={`/exams/${r.id}`}></Link>}>
              Open
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={
                <Button size="xs" variant="destructive">
                  Delete
                </Button>
              }
              title="Delete exam"
              description={`Delete "${r.title}" and all its results? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() => deleteExam(r.id, { onError })}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Exams</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/exams/new"></Link>}>
            New exam
          </Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">
          {forbiddenMsg}
        </p>
      )}
      <DataTable
        columns={columns}
        rows={exams}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No exams found."
      />
    </div>
  );
}
