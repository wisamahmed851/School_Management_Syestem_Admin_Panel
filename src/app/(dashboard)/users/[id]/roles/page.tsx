"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useUser } from "@/hooks/use-users";
import { useUserRolesList } from "@/hooks/use-user-roles";
import { useRolesList } from "@/hooks/use-roles";
import { userRolesApi } from "@/lib/api/user-roles";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserRolesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: user, isPending: userPending, isError: userError } = useUser(id);
  const { data: allAssignments = [], isPending: assignPending } = useUserRolesList();
  // Only user-guard roles are relevant for user accounts
  const { data: availableRoles = [], isPending: rolesPending } = useRolesList("user");

  const isLoading = userPending || assignPending || rolesPending;

  const userId = Number(id);
  const originalAssignments = useMemo(
    () => allAssignments.filter((a) => a.user_id === userId),
    [allAssignments, userId]
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
      userRolesApi
        .create({ user_id: userId, role_id: roleId })
        .then(() => ({ ok: true }))
        .catch((err) => {
          if (isAxiosError(err) && err.response?.status === 409) return { ok: true };
          return { ok: false };
        })
    );
    const removeCalls = toRemove.map((a) =>
      userRolesApi
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

    await qc.invalidateQueries({ queryKey: ["user-roles"] });
    setSaving(false);
    setSaveResult({ succeeded, failed });
  };

  if (userError || (!userPending && !user)) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive">User not found.</p>
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
              <>Roles — {user?.name}</>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Assign user-guard roles to this user account.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/users")}>
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
          No user-guard roles available.
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
