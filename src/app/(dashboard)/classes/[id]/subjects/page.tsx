"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useClass } from "@/hooks/use-classes";
import {
  useClassSubjectsByClass,
  useCreateClassSubject,
  useDeleteClassSubject,
} from "@/hooks/use-class-subjects";
import { useSubjectsList } from "@/hooks/use-subjects";
import { useTeachersList } from "@/hooks/use-teachers";
import SearchableSelect from "@/components/shared/SearchableSelect";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClassSubjectByClassItem } from "@/types/class-subject";

export default function ClassSubjectsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const classId = Number(id);

  const { data: cls, isPending: classPending } = useClass(id);
  const { data: mappings = [], isPending: mappingsPending } =
    useClassSubjectsByClass(id);
  const { data: allSubjects = [], isPending: subjectsPending } =
    useSubjectsList();
  const { mutate: createMapping, isPending: isAdding } =
    useCreateClassSubject();
  const { mutate: deleteMapping, isPending: isRemoving } =
    useDeleteClassSubject();

  // Add-form state
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [subjectFilter, setSubjectFilter] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const { data: teachers = [], isPending: teachersLoading } = useTeachersList(
    teacherSearch || undefined
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  // Subject options — static list, client-side filtered (no backend search for subjects)
  const filteredSubjects = allSubjects.filter((s) =>
    subjectFilter
      ? s.name.toLowerCase().includes(subjectFilter.toLowerCase()) ||
        s.code.toLowerCase().includes(subjectFilter.toLowerCase())
      : true
  );
  const subjectOptions = filteredSubjects.map((s) => ({
    id: s.id,
    label: s.name,
    sublabel: s.code,
  }));
  const teacherOptions = teachers.map((t) => ({
    id: t.id,
    label: t.name,
    sublabel: t.subject_specialization ?? t.email,
  }));

  const mappedSubjectIds = new Set(mappings.map((m) => m.subject_id));

  const handleAdd = () => {
    setFormError(null);
    if (!selectedSubjectId) {
      setFormError("Please select a subject.");
      return;
    }
    if (mappedSubjectIds.has(selectedSubjectId)) {
      setFormError("This subject is already mapped to this class.");
      return;
    }
    createMapping(
      {
        class_id: classId,
        subject_id: selectedSubjectId,
        teacher_id: selectedTeacherId ?? undefined,
      },
      {
        onSuccess: () => {
          setSelectedSubjectId(null);
          setSelectedTeacherId(null);
          setTeacherSearch("");
          setSubjectFilter("");
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 409) {
              setFormError("This subject is already mapped to this class.");
            } else if (status === 403) {
              setForbiddenMsg("Insufficient permissions.");
            } else {
              setFormError(
                typeof message === "string"
                  ? message
                  : "An unexpected error occurred."
              );
            }
          }
        },
      }
    );
  };

  const handleRemove = (mapping: ClassSubjectByClassItem) => {
    deleteMapping(
      { id: mapping.id, classId },
      {
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403)
            setForbiddenMsg("Insufficient permissions.");
        },
      }
    );
  };

  const isLoading = classPending || mappingsPending || subjectsPending;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {classPending ? (
              <Skeleton className="h-5 w-40 inline-block" />
            ) : (
              <>Subjects — {cls?.name}</>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage which subjects and optional teachers are assigned to this
            class.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/classes")}
        >
          Back
        </Button>
      </div>

      {forbiddenMsg && (
        <p role="alert" className="text-sm text-destructive">
          {forbiddenMsg}
        </p>
      )}

      {/* Existing mappings */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Subject
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Teacher
              </th>
              <th className="px-4 py-2.5 text-right font-medium text-muted-foreground w-24">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-4 py-2.5">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td />
                </tr>
              ))
            ) : mappings.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No subjects assigned yet.
                </td>
              </tr>
            ) : (
              mappings.map((m) => {
                return (
                  <tr key={m.id}>
                    <td className="px-4 py-2.5 text-foreground">
                      {m.subject_name ? (
                        <>
                          {m.subject_name}
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {m.subject_code}
                          </span>
                        </>
                      ) : (
                        `#${m.subject_id}`
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {m.teacher_name ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ConfirmDialog
                        trigger={
                          <Button size="xs" variant="destructive">
                            Remove
                          </Button>
                        }
                        title="Remove subject mapping"
                        description={`Remove ${m.subject_name ?? "this subject"} from the class?`}
                        confirmLabel="Remove"
                        destructive
                        isLoading={isRemoving}
                        onConfirm={() => handleRemove(m)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add subject form */}
      <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
        <h2 className="text-sm font-medium text-foreground">Add subject</h2>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Subject</span>
            {/* No backend search for subjects — onSearch does client-side filtering */}
            <SearchableSelect
              value={selectedSubjectId}
              onChange={setSelectedSubjectId}
              onSearch={setSubjectFilter}
              options={subjectOptions}
              isLoading={subjectsPending}
              placeholder="Select a subject"
              emptyMessage="No subjects found."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Teacher{" "}
              <span className="text-muted-foreground">(optional)</span>
            </span>
            {/* Backend search — onSearch triggers useTeachersList refetch */}
            <SearchableSelect
              value={selectedTeacherId}
              onChange={setSelectedTeacherId}
              onSearch={setTeacherSearch}
              options={teacherOptions}
              isLoading={teachersLoading}
              placeholder="Search and select a teacher"
              emptyMessage="No teachers found."
              clearable
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={isAdding || !selectedSubjectId}
          >
            {isAdding ? "Adding…" : "Add subject"}
          </Button>
        </div>
      </div>
    </div>
  );
}
