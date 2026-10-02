"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useClassesList, useDeleteClass, useToggleClassStatus } from "@/hooks/use-classes";
import { useClassSubjectsByClass } from "@/hooks/use-class-subjects";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { SchoolClass } from "@/types/class";

/** Per-row component that fetches and shows the subject count for a class (PART G) */
function SubjectCountBadge({ classId }: { classId: number }) {
  const { data = [], isPending } = useClassSubjectsByClass(classId);
  if (isPending) return <span className="text-xs text-muted-foreground">…</span>;
  return (
    <span className="text-xs text-muted-foreground">
      {data.length} subject{data.length !== 1 ? "s" : ""}
    </span>
  );
}

export default function ClassesPage() {
  const { data: classes = [], isPending } = useClassesList();
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClass();
  const { mutate: toggleStatus } = useToggleClassStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/classes");

  const columns: ColumnDef<SchoolClass>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "section", header: "Section", cell: (r) => r.section ?? "—" },
    {
      key: "subjects",
      header: "Subjects",
      cell: (r) => <SubjectCountBadge classId={r.id} />,
    },
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
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/classes/${r.id}/subjects`}></Link>}>
              Subjects
            </Button>
          )}
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
            <Button size="xs" variant="outline" render={<Link href={`/classes/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete class"
              description={`Delete "${r.name}"? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() => deleteClass(r.id, {
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
        <h1 className="text-lg font-semibold text-foreground">Classes</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/classes/new"></Link>}>New class</Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable columns={columns} rows={classes} getRowKey={(r) => r.id} isLoading={isPending} emptyMessage="No classes found." />
    </div>
  );
}
