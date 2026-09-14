"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAdmin } from "@/hooks/use-admins";
import { useAdminRolesList } from "@/hooks/use-admin-roles";
import { useRolesList } from "@/hooks/use-roles";
import { adminRolesApi } from "@/lib/api/admin-roles";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRolesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: admin, isPending: adminPending, isError: adminError } = useAdmin(id);
  const { data: allAssignments = [], isPending: assignPending } = useAdminRolesList();
  // Only admin-guard roles are relevant for admin accounts
  const { data: availableRoles = [], isPending: rolesPending } = useRolesList("admin");

  const isLoading = adminPending || assignPending || rolesPending;

  const adminId = Number(id);
  const originalAssignments = useMemo(
    () => allAssignments.filter((a) => a.admin_id === adminId),
    [allAssignments, adminId]
  );
  const originalSelectedIds = useMemo(
    () => originalAssignments.map((a) => a.role_id),
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

  const toggleRole = (roleId: number) => {
    const next = new Set(effectiveSelected);
    if (next.has(roleId)) {
      next.delete(roleId);
    } else {
      next.add(roleId);
    }
    setSelectedIds(Array.from(next));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);

    const next = new Set(effectiveSelected);
    const original = new Set(originalSelectedIds);

    const toAdd = [...next].filter((rid) => !original.has(rid));
    const toRemove = originalAssignments.filter((a) => !next.has(a.role_id));

    const addCalls = toAdd.map((roleId) =>
      adminRolesApi
        .create({ admin_id: adminId, role_id: roleId })
        .then(() => ({ ok: true }))
        .catch((err) => {
          if (isAxiosError(err) && err.response?.status === 409) return { ok: true };
          return { ok: false };
        })
    );
    const removeCalls = toRemove.map((a) =>
      adminRolesApi
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

    await qc.invalidateQueries({ queryKey: ["admin-roles"] });
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
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>Roles — {admin?.name}</>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Assign admin-guard roles to this admin account.
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
            : "Roles saved successfully."}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : availableRoles.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No admin-guard roles available.
        </p>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {availableRoles.map((role) => (
            <label
              key={role.id}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Checkbox
                id={`role-${role.id}`}
                checked={effectiveSelected.includes(role.id)}
                onCheckedChange={() => toggleRole(role.id)}
              />
              <span className="text-foreground">{role.name}</span>
              {role.status !== 1 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  inactive
                </span>
              )}
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || isLoading}>
          {saving ? "Saving…" : "Save roles"}
        </Button>
      </div>
    </div>
  );
}
