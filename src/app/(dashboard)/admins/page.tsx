"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAdminsList, useDeleteAdmin, useToggleAdminStatus } from "@/hooks/use-admins";
import { useSidebar } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { AdminRecord } from "@/types/admin-resource";

export default function AdminsPage() {
  const { data: admins = [], isPending } = useAdminsList();
  const { data: sidebar } = useSidebar();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { mutate: toggleStatus } = useToggleAdminStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const node = sidebar?.menu
    .flatMap((n) => ("children" in n ? n.children : [n]))
    .find((n) => "route" in n && n.route === "/admins");
  const actions = node && "actions" in node ? node.actions : {};

  const handleDelete = (id: number) => {
    deleteAdmin(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions to delete this admin.");
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

  const columns: ColumnDef<AdminRecord>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    {
      key: "name",
      header: "Name",
      cell: (r) => (
        <div className="flex items-center gap-2">
          {r.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.image} alt={r.name} className="h-7 w-7 rounded-full object-cover border border-border" />
          )}
          <span>{r.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", cell: (r) => r.email },
    { key: "created_at", header: "Created", cell: (r) => r.created_at },
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
            <Button size="xs" variant="outline" onClick={() => handleToggle(r.id)}>
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" asChild>
              <Link href={`/admins/${r.id}/permissions`}>Permissions</Link>
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" asChild>
              <Link href={`/admins/${r.id}/roles`}>Roles</Link>
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" asChild>
              <Link href={`/admins/${r.id}`}>Edit</Link>
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete admin"
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
        <h1 className="text-lg font-semibold text-foreground">Admins</h1>
        {actions.create && (
          <Button size="sm" asChild>
            <Link href="/admins/new">New admin</Link>
          </Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable
        columns={columns}
        rows={admins}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No admins found."
      />
    </div>
  );
}
