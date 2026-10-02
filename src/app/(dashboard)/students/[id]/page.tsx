"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useStudent, useUpdateStudent } from "@/hooks/use-students";
import { useGuardiansList } from "@/hooks/use-guardians";
import { useClassesList } from "@/hooks/use-classes";
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
import { omitEmpty } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().optional(),
  roll_no: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  identity_number: z.string().min(1, "Identity number is required"),
  admission_date: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: student, isPending, isError } = useStudent(id);
  const { mutate: updateStudent, isPending: isSaving } = useUpdateStudent();

  // Guardian — search-backed (backend search via ?search=)
  const [guardianSearch, setGuardianSearch] = useState("");
  // undefined = untouched, so the value follows the loaded student until the user picks
  const [guardianEdit, setGuardianId] = useState<number | null | undefined>();
  const guardianId =
    guardianEdit === undefined ? (student?.guardian_id ?? null) : guardianEdit;
  const { data: guardians = [], isPending: guardiansLoading } =
    useGuardiansList(guardianSearch || undefined);
  const guardianOptions = guardians.map((g) => ({
    id: g.id,
    label: g.name,
    sublabel: g.phone ?? g.email ?? undefined,
  }));

  // Class — static list, client-side filtered (no backend search route)
  const [classFilter, setClassFilter] = useState("");
  const [classEdit, setClassId] = useState<number | null | undefined>();
  const classId = classEdit === undefined ? (student?.class_id ?? null) : classEdit;
  const { data: classes = [], isPending: classesLoading } = useClassesList();
  const filteredClasses = classes.filter((c) =>
    classFilter
      ? c.name.toLowerCase().includes(classFilter.toLowerCase())
      : true
  );
  const classOptions = filteredClasses.map((c) => ({
    id: c.id,
    label: c.name,
    sublabel: c.section ?? undefined,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      roll_no: "",
      dob: "",
      gender: "",
      identity_number: "",
      admission_date: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        roll_no: student.roll_no,
        dob: student.dob ?? "",
        gender: student.gender ?? "",
        identity_number: student.identity_number ?? "",
        admission_date: student.admission_date ?? "",
      });
    }
  }, [student, form]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg py-8 flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <p className="text-sm text-destructive">Student not found.</p>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    updateStudent(
      {
        id,
        payload: {
          ...omitEmpty(values),
          guardian_id: guardianId ?? undefined,
          class_id: classId ?? undefined,
        },
      },
      {
        onSuccess: () => router.push("/students"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
            } else if (status === 404) {
              form.setError("root", { message: "Student not found." });
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
          <CardTitle>Edit Student</CardTitle>
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

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="roll_no" render={({ field }) => (
                <FormItem><FormLabel>Roll No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              {/* Guardian — search-backed */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Guardian
                </span>
                <SearchableSelect
                  value={guardianId}
                  onChange={setGuardianId}
                  onSearch={setGuardianSearch}
                  options={guardianOptions}
                  isLoading={guardiansLoading}
                  placeholder="Search guardian by name or contact"
                  emptyMessage="No guardians found."
                />
              </div>

              {/* Class — static list, client-side filtered */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Class
                </span>
                <SearchableSelect
                  value={classId}
                  onChange={setClassId}
                  onSearch={setClassFilter}
                  options={classOptions}
                  isLoading={classesLoading}
                  placeholder="Select a class"
                  emptyMessage="No classes found."
                />
              </div>

              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem><FormLabel>Date of birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem><FormLabel>Gender</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="identity_number" render={({ field }) => (
                <FormItem><FormLabel>Identity number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="admission_date" render={({ field }) => (
                <FormItem><FormLabel>Admission date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/students")}
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
