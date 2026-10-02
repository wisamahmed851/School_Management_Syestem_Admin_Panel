"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import {
  useTeachersList,
  useDeleteTeacher,
  useToggleTeacherStatus,
} from "@/hooks/use-teachers";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Teacher } from "@/types/teacher";

export default function TeachersPage() {
  const { data: teachers = [], isPending } = useTeachersList();
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher();
  const { mutate: toggleStatus } = useToggleTeacherStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/teachers");

  const handleDelete = (id: number) => {
    deleteTeacher(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions to delete this teacher.");
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

  const columns: ColumnDef<Teacher>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "email", header: "Email", cell: (r) => r.email },
    {
      key: "specialization",
      header: "Specialization",
      cell: (r) => r.subject_specialization ?? "—",
    },
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
      className: "w-56 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/teachers/${r.id}/subjects`}></Link>}>
              Assignments
            </Button>
          )}
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
            <Button size="xs" variant="outline" render={<Link href={`/teachers/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete teacher"
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
        <h1 className="text-lg font-semibold text-foreground">Teachers</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/teachers/new"></Link>}>
            New teacher
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
        rows={teachers}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No teachers found."
      />
    </div>
  );
}
