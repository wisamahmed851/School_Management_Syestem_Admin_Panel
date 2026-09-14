"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAdmin } from "@/hooks/use-admins";
import { useAdminPermissionsList } from "@/hooks/use-admin-permissions";
import { usePermissionsList } from "@/hooks/use-permissions";
import { adminPermissionsApi } from "@/lib/api/admin-permissions";
import { useQueryClient } from "@tanstack/react-query";
import PermissionMatrix from "@/components/shared/PermissionMatrix";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPermissionsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: admin, isPending: adminPending, isError: adminError } = useAdmin(id);
  const { data: allAssignments = [], isPending: assignPending } = useAdminPermissionsList();
  const { data: allPermissions = [], isPending: permsPending } = usePermissionsList();

  const isLoading = adminPending || assignPending || permsPending;

  const adminId = Number(id);
  const originalAssignments = useMemo(
    () => allAssignments.filter((a) => a.admin_id === adminId),
    [allAssignments, adminId]
  );
  const originalSelectedIds = useMemo(
    () => originalAssignments.map((a) => a.permission_id),
    [originalAssignments]
  );

  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const effectiveSelected =
    selectedIds !== null ? selectedIds : originalSelectedIds;

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    succeeded: number;
    failed: number;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);

    const next = new Set(effectiveSelected);
    const original = new Set(originalSelectedIds);

    const toAdd = [...next].filter((pid) => !original.has(pid));
    const toRemove = originalAssignments.filter((a) => !next.has(a.permission_id));

    const addCalls = toAdd.map((permId) =>
      adminPermissionsApi
        .create({ admin_id: adminId, permission_id: permId })
        .then(() => ({ ok: true }))
        .catch((err) => {
          if (isAxiosError(err) && err.response?.status === 409) return { ok: true };
          return { ok: false };
        })
    );
    const removeCalls = toRemove.map((a) =>
      adminPermissionsApi
        .remove(a.id)
        .then(() => ({ ok: true }))
        .catch(() => ({ ok: false }))
    );

    const results = await Promise.allSettled([...addCalls, ...removeCalls]);
    const flat = results.map((r) =>
      r.status === "fulfilled" ? r.value : { ok: false }
    );
    const succeeded = flat.filter((r) => r.ok).length;
    const failed = flat.filter((r) => !r.ok).length;

    await qc.invalidateQueries({ queryKey: ["admin-permissions"] });
    setSaving(false);
    setSaveResult({ succeeded, failed });
  };

  if (adminError || (!adminPending && !admin)) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive">Admin not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>Permissions — {admin?.name}</>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select which permissions are directly assigned to this admin.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/admins")}>
          Back
        </Button>
      </div>

      {saveResult && (
        <div
          role="status"
          className={
            saveResult.failed > 0
              ? "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              : "rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
          }
        >
          {saveResult.failed > 0
            ? `Saved with ${saveResult.failed} error(s). ${saveResult.succeeded} change(s) applied successfully.`
            : "Permissions saved successfully."}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <PermissionMatrix
          allPermissions={allPermissions}
          selectedIds={effectiveSelected}
          onChange={setSelectedIds}
        />
      )}

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} disabled={saving || isLoading}>
          {saving ? "Saving…" : "Save permissions"}
        </Button>
      </div>
    </div>
  );
}
