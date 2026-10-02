"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAssignmentsList, useDeleteAssignment } from "@/hooks/use-assignments";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Assignment } from "@/types/assignment";

export default function AssignmentsPage() {
  const { data: assignments = [], isPending } = useAssignmentsList();
  const { mutate: deleteAssignment, isPending: isDeleting } = useDeleteAssignment();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);
  const { actions } = useRouteActions("/assignments");

  const columns: ColumnDef<Assignment>[] = [
    { key: "title", header: "Title", cell: (r) => r.title },
    { key: "class", header: "Class", cell: (r) => r.class_name ?? `#${r.class_id}` },
    { key: "subject", header: "Subject", cell: (r) => r.subject_name ?? "—" },
    { key: "teacher", header: "Teacher", cell: (r) => r.teacher_name ?? "—" },
    { key: "due", header: "Due", cell: (r) => r.due_date },
    {
      key: "actions",
      header: "",
      className: "w-44 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {(actions.findOne || actions.update || actions.gradeSubmission) && (
            <Button size="xs" variant="outline" render={<Link href={`/assignments/${r.id}`}></Link>}>
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
              title="Delete assignment"
              description={`Delete "${r.title}" and all its submissions? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() =>
                deleteAssignment(r.id, {
                  onError: (err) => {
                    if (isAxiosError(err) && err.response?.status === 403)
                      setForbiddenMsg("Insufficient permissions.");
                  },
                })
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Assignments</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/assignments/new"></Link>}>
            New assignment
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
        rows={assignments}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No assignments found."
      />
    </div>
  );
}
