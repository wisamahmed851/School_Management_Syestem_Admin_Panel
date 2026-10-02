"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useClass, useUpdateClass } from "@/hooks/use-classes";
import { useTeachersList } from "@/hooks/use-teachers";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().optional(),
  section: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditClassPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: cls, isPending, isError } = useClass(id);
  const { mutate: updateClass, isPending: isSaving } = useUpdateClass();

  const [teacherSearch, setTeacherSearch] = useState("");
  // undefined = untouched, so the value follows the loaded class until the user picks
  const [teacherEdit, setTeacherId] = useState<number | null | undefined>();
  const teacherId =
    teacherEdit === undefined ? (cls?.class_teacher_id ?? null) : teacherEdit;
  const { data: teachers = [], isPending: teachersLoading } = useTeachersList(
    teacherSearch || undefined
  );
  const teacherOptions = teachers.map((t) => ({
    id: t.id,
    label: t.name,
    sublabel: t.subject_specialization ?? t.email,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", section: "" },
  });

  useEffect(() => {
    if (cls) {
      form.reset({ name: cls.name, section: cls.section ?? "" });
    }
  }, [cls, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !cls) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Class not found.</p>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    updateClass(
      {
        id,
        payload: {
          ...values,
          // null explicitly clears the teacher; undefined leaves unchanged —
          // we always send the current value so unset is deliberate
          class_teacher_id: teacherId,
        },
      },
      {
        onSuccess: () => router.push("/classes"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Class not found." });
            } else {
              form.setError("root", {
                message:
                  typeof message === "string"
                    ? message
                    : "An unexpected error occurred.",
              });
            }
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {form.formState.errors.root && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Class teacher{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </span>
                <SearchableSelect
                  value={teacherId}
                  onChange={setTeacherId}
                  onSearch={setTeacherSearch}
                  options={teacherOptions}
                  isLoading={teachersLoading}
                  placeholder="Search and select a teacher"
                  emptyMessage="No teachers found."
                  clearable
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/classes")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
