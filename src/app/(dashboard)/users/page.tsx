"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useUsersList, useToggleUserStatus } from "@/hooks/use-users";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { uploadUrl } from "@/lib/utils";

export default function UsersPage() {
  const { data: users = [], isPending } = useUsersList();
  const { mutate: toggleStatus } = useToggleUserStatus();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/users");

  // Users have no delete route per API docs section 3 — only toggleStatus
  const handleToggle = (id: number) => {
    toggleStatus(id, {
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 403)
          setForbiddenMsg("Insufficient permissions.");
      },
    });
  };

  const columns: ColumnDef<User>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    {
      key: "name",
      header: "Name",
      cell: (r) => (
        <div className="flex items-center gap-2">
          {r.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={uploadUrl(r.image)} alt={r.name} className="h-7 w-7 rounded-full object-cover border border-border" />
          )}
          <span>{r.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", cell: (r) => r.email },
    { key: "phone", header: "Phone", cell: (r) => r.phone ?? "—" },
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
            <Button size="xs" variant="outline" onClick={() => handleToggle(r.id)}>
              {r.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/users/${r.id}/permissions`}></Link>}>
              Permissions
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/users/${r.id}/roles`}></Link>}>
              Roles
            </Button>
          )}
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/users/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Users</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/users/new"></Link>}>
            New user
          </Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable
        columns={columns}
        rows={users}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        emptyMessage="No users found."
      />
    </div>
  );
}
