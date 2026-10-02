"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useCreateStudent } from "@/hooks/use-students";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  roll_no: z.string().min(1, "Roll No. is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  identity_number: z.string().min(1, "Identity number is required"),
  admission_date: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewStudentPage() {
  const router = useRouter();
  const { mutate: createStudent, isPending } = useCreateStudent();

  // Guardian — search-backed
  const [guardianSearch, setGuardianSearch] = useState("");
  const [guardianId, setGuardianId] = useState<number | null>(null);
  const { data: guardians = [], isPending: guardiansLoading } = useGuardiansList(
    guardianSearch || undefined
  );
  const guardianOptions = guardians.map((g) => ({
    id: g.id,
    label: g.name,
    sublabel: g.phone ?? g.email ?? undefined,
  }));

  // Class — static list, client-side filtered
  const [classFilter, setClassFilter] = useState("");
  const [classId, setClassId] = useState<number | null>(null);
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

  const [fkError, setFkError] = useState<string | null>(null);

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

  const onSubmit = (values: FormValues) => {
    setFkError(null);
    if (!guardianId) {
      setFkError("Please select a guardian.");
      return;
    }
    if (!classId) {
      setFkError("Please select a class.");
      return;
    }

    createStudent(
      {
        ...omitEmpty(values),
        name: values.name,
        roll_no: values.roll_no,
        identity_number: values.identity_number,
        guardian_id: guardianId,
        class_id: classId,
      },
      {
        onSuccess: () => router.push("/students"),
        onError: (err) => {
          if (isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message;
            if (status === 409) {
              form.setError("roll_no", {
                message:
                  typeof message === "string"
                    ? message
                    : "Roll No. already exists in this class",
              });
            } else if (status === 403) {
              form.setError("root", { message: "Insufficient permissions." });
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
          <CardTitle>New Student</CardTitle>
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
              {fkError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {fkError}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ali Hassan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roll_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll No.</FormLabel>
                    <FormControl>
                      <Input placeholder="GR5A-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of birth{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="male / female" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identity_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Identity number
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admission_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Admission date{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? "Creating…" : "Enroll student"}
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
