"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Permission } from "@/types/permission";

interface PermissionMatrixProps {
  allPermissions: Permission[];
  selectedIds: number[];
  onChange: (nextSelectedIds: number[]) => void;
}

/**
 * Controlled, module-grouped permission picker.
 * Groups permissions by their "module" field, each section collapsible.
 * Module header has a tri-state checkbox (all / some / none).
 * Individual rows show the "action" field (not the full dotted name).
 * Does not call any API itself — pure controlled UI.
 */
export function PermissionMatrix({
  allPermissions,
  selectedIds,
  onChange,
}: PermissionMatrixProps) {
  // Track which module sections are collapsed
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Group by module
  const grouped = allPermissions.reduce<Record<string, Permission[]>>(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module].push(p);
      return acc;
    },
    {}
  );
  const modules = Object.keys(grouped).sort();

  const selectedSet = new Set(selectedIds);

  const togglePermission = (id: number) => {
    const next = new Set(selectedSet);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(Array.from(next));
  };

  const toggleModule = (module: string) => {
    const perms = grouped[module];
    const allSelected = perms.every((p) => selectedSet.has(p.id));
    const next = new Set(selectedSet);
    if (allSelected) {
      perms.forEach((p) => next.delete(p.id));
    } else {
      perms.forEach((p) => next.add(p.id));
    }
    onChange(Array.from(next));
  };

  const getModuleState = (module: string) => {
    const perms = grouped[module];
    const count = perms.filter((p) => selectedSet.has(p.id)).length;
    if (count === 0) return "none";
    if (count === perms.length) return "all";
    return "some";
  };

  return (
    <div className="flex flex-col gap-2">
      {modules.map((module) => {
        const perms = grouped[module];
        const state = getModuleState(module);
        const isCollapsed = collapsed[module] ?? false;

        return (
          <div
            key={module}
            className="rounded-lg border border-border overflow-hidden"
          >
            {/* Module header */}
            <div className="flex items-center gap-3 bg-muted px-4 py-2.5">
              <Checkbox
                checked={state === "all"}
                indeterminate={state === "some"}
                onCheckedChange={() => toggleModule(module)}
                aria-label={`Select all ${module} permissions`}
              />
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({
                    ...prev,
                    [module]: !prev[module],
                  }))
                }
                className="flex flex-1 items-center justify-between text-left text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
              >
                <span className="capitalize">{module}</span>
                <span className="text-xs text-muted-foreground">
                  {perms.filter((p) => selectedSet.has(p.id)).length}/
                  {perms.length}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`ml-1.5 inline transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Individual permissions */}
            {!isCollapsed && (
              <div className="divide-y divide-border">
                {perms.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Checkbox
                      id={`perm-${p.id}`}
                      checked={selectedSet.has(p.id)}
                      onCheckedChange={() => togglePermission(p.id)}
                    />
                    <span className="text-foreground">{p.action}</span>
                    {p.status !== 1 && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        inactive
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {modules.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No permissions available.
        </p>
      )}
    </div>
  );
}

export default PermissionMatrix;
