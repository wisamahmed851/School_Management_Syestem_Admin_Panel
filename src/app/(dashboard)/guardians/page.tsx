"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useGuardiansList, useDeleteGuardian } from "@/hooks/use-guardians";
import { useRouteActions } from "@/hooks/use-sidebar";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Guardian } from "@/types/guardian";

export default function GuardiansPage() {
  const { data: guardians = [], isPending } = useGuardiansList();
  const { mutate: deleteGuardian, isPending: isDeleting } = useDeleteGuardian();
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  const { actions } = useRouteActions("/guardians");

  const columns: ColumnDef<Guardian>[] = [
    { key: "id", header: "ID", cell: (r) => r.id, className: "w-16" },
    { key: "name", header: "Name", cell: (r) => r.name },
    { key: "phone", header: "Phone", cell: (r) => r.phone ?? "—" },
    { key: "email", header: "Email", cell: (r) => r.email ?? "—" },
    { key: "relation", header: "Relation", cell: (r) => r.relation_to_student ?? "—" },
    {
      key: "actions",
      header: "",
      className: "w-32 text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          {actions.update && (
            <Button size="xs" variant="outline" render={<Link href={`/guardians/${r.id}`}></Link>}>
              Edit
            </Button>
          )}
          {actions.remove && (
            <ConfirmDialog
              trigger={<Button size="xs" variant="destructive">Delete</Button>}
              title="Delete guardian"
              description={`Delete "${r.name}"? This cannot be undone.`}
              confirmLabel="Delete"
              destructive
              isLoading={isDeleting}
              onConfirm={() => deleteGuardian(r.id, {
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
        <h1 className="text-lg font-semibold text-foreground">Guardians</h1>
        {actions.create && (
          <Button size="sm" render={<Link href="/guardians/new"></Link>}>New guardian</Button>
        )}
      </div>
      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">{forbiddenMsg}</p>
      )}
      <DataTable columns={columns} rows={guardians} getRowKey={(r) => r.id} isLoading={isPending} emptyMessage="No guardians found." />
    </div>
  );
}
