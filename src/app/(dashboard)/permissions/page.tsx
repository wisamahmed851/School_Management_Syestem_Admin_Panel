"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { usePermissionsList, useDeletePermission, useTogglePermissionStatus } from "@/hooks/use-permissions";
import { useSidebar } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Permission } from "@/types/permission";

export default function PermissionsPage() {
  const { data: permissions = [], isPending } = usePermissionsList();
  const { data: sidebar } = useSidebar();
  const { mutate: deletePermission, isPending: isDeleting } = useDeletePermission();
  const { mutate: toggleStatus } = useTogglePermissionStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const permNode = sidebar?.menu
    .flatMap((n) => ("children" in n ? n.children : [n]))
    .find((n) => "route" in n && n.route === "/permissions");
  const actions = permNode && "actions" in permNode ? permNode.actions : {};

  const handleDelete = (id: number) => {
    deletePermission(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions to delete.");
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

  const columns: ColumnDef<Permission>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "module", header: "Module", cell: (r) => r.module },
    { key: "action", header: "Action", cell: (r) => r.action },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "guard", header: "Guard", cell: (r) => r.guard },
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
              <Link href={`/permissions/${r.id}`}>Edit</Link>
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete permission"
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
        <h1 className="text-lg font-semibold text-foreground">Permissions</h1>
        {actions.create && (
          <Button size="sm" asChild>
            <Link href="/permissions/new">New permission</Link>
          </Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable
        columns={columns}
        rows={permissions}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No permissions found."
      />
    </div>
  );
}
