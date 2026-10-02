"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useSubjectsList, useDeleteSubject, useToggleSubjectStatus } from "@/hooks/use-subjects";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/types/subject";

export default function SubjectsPage() {
  const { data: subjects = [], isPending } = useSubjectsList();
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();
  const { mutate: toggleStatus } = useToggleSubjectStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/subjects");

  const columns: ColumnDef<Subject>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "code", header: "Code", cell: (r) => r.code },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status === 1 ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-44 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {actions.toggleStatus && (
            <Button size="xs" variant="outline" onClick={() => toggleStatus(r.id, {
              onError: (err) => {
                if (isAxiosError(err) && err.response?.status === 403)
                  setForbiddenMsg("Insufficient permissions.");
              },
            })}>
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/subjects/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete subject"
              description={`Delete "${r.name}"? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() => deleteSubject(r.id, {
                onError: (err) => {
                  if (isAxiosError(err) && err.response?.status === 403)
                    setForbiddenMsg("Insufficient permissions.");
                },
              })}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Subjects</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/subjects/new"></Link>}>New subject</Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable columns={columns} rows={subjects} getRowKey={(r) => r.id} isLoading={isPending} emptyMessage="No subjects found." />
    </div>
  );
}
