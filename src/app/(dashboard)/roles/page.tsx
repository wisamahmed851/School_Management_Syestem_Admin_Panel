"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useRolesList, useDeleteRole, useToggleRoleStatus } from "@/hooks/use-roles";
import { useSidebar } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/role";

export default function RolesPage() {
  const { data: roles = [], isPending } = useRolesList();
  const { data: sidebar } = useSidebar();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
  const { mutate: toggleStatus } = useToggleRoleStatus();

  // Gate actions from sidebar leaf node per ARCHITECTURE.txt
  const rolesNode = sidebar?.menu
    .flatMap((n) => ("children" in n ? n.children : [n]))
    .find((n) => "route" in n && n.route === "/roles");
  const actions = rolesNode && "actions" in rolesNode ? rolesNode.actions : {};

  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const handleDelete = (id: number) => {
    deleteRole(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403) {
          setForbiddenMsg("Insufficient permissions to delete this role.");
        }
      },
    });
  };

  const handleToggle = (id: number) => {
    toggleStatus(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403) {
          setForbiddenMsg("Insufficient permissions.");
        }
      },
    });
  };

  const columns: ColumnDef<Role>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "guard", header: "Guard", cell: (r) => r.guard },
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
          {actions.toggleStatus && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleToggle(r.id)}
            >
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {/* Gate on role-permissions.create/.index if present; fall back to
              roles.update as the closest available permission. */}
          {actions.update && (
            <Button size="xs" variant="outline" asChild>
              <Link href={`/roles/${r.id}/permissions`}>Permissions</Link>
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" asChild>
              <Link href={`/roles/${r.id}`}>Edit</Link>
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={
                <Button size="xs" variant="destructive">
                  Delete
                </Button>
              }
              title="Delete role"
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
        <h1 className="text-lg font-semibold text-foreground">Roles</h1>
        {actions.create && (
          <Button size="sm" asChild>
            <Link href="/roles/new">New role</Link>
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
        rows={roles}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No roles found."
      />
    </div>
  );
}
