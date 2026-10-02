"use client";

import { useParams, useRouter } from "next/navigation";
import { useTeacher } from "@/hooks/use-teachers";
import { useClassSubjectsByTeacher } from "@/hooks/use-class-subjects";
import { useClassesList } from "@/hooks/use-classes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherSubjectsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: teacher, isPending: teacherPending, isError } = useTeacher(id);
  const { data: mappings = [], isPending: mappingsPending } =
    useClassSubjectsByTeacher(id);
  const { data: classes = [], isPending: classesPending } = useClassesList();

  const isLoading =
    teacherPending || mappingsPending || classesPending;

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));

  if (isError || (!teacherPending && !teacher)) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive">Teacher not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {teacherPending ? (
              <Skeleton className="h-5 w-48 inline-block" />
            ) : (
              <>Assignments — {teacher?.name}</>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Read-only. To add or remove assignments, use the Classes page.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/teachers")}
        >
          Back
        </Button>
      </div>

      {/* Assignments — read-only table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Class
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Subject
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-2.5">
                    <Skeleton className="h-4 w-28" />
                  </td>
                </tr>
              ))
            ) : mappings.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No class-subject assignments found for this teacher.
                </td>
              </tr>
            ) : (
              mappings.map((m) => {
                const cls = classMap[m.class_id];
                return (
                  <tr key={m.id}>
                    <td className="px-4 py-2.5 text-foreground">
                      {m.class_name ?? `Class #${m.class_id}`}
                      {cls?.section && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {cls.section}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-foreground">
                      {m.subject_name ? (
                        <>
                          {m.subject_name}
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {m.subject_code}
                          </span>
                        </>
                      ) : (
                        `Subject #${m.subject_id}`
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
