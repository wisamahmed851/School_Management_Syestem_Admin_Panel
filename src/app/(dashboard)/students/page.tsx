"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import {
  useStudentsList,
  useDeleteStudent,
  useToggleStudentStatus,
} from "@/hooks/use-students";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types/student";

export default function StudentsPage() {
  const { data: students = [], isPending } = useStudentsList();
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();
  const { mutate: toggleStatus } = useToggleStudentStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/students");

  const handleDelete = (id: number) => {
    deleteStudent(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions to delete this student.");
      },
    });
  };

  const handleToggle = (id: number) => {
    toggleStatus(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions.");
      },
    });
  };

  const columns: ColumnDef<Student>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "roll_no", header: "Roll No.", cell: (r) => r.roll_no },
    { key: "class_id", header: "Class", cell: (r) => r.class_name ?? `#${r.class_id}` },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <StatusBadge status={r.status === 1 ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-44 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {actions.toggleStatus && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleToggle(r.id)}
            >
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/students/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={
                <Button size="xs" variant="destructive">
                  Delete
                </Button>
              }
              title="Delete student"
              description={`Delete "${r.name}"? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() => handleDelete(r.id)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Students</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/students/new"></Link>}>
            New student
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
        rows={students}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No students found."
      />
    </div>
  );
}
