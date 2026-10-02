"use client";

import Link from "next/link";
import { isAxiosError } from "axios";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 pt-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold text-foreground">{value}</span>
      </CardContent>
    </Card>
  );
}

function UpcomingList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { id: number; title: string; date: string; class_name: string | null; href: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={i.href} className="text-foreground hover:underline">
                  {i.title}
                  {i.class_name && (
                    <span className="ml-1.5 text-xs text-muted-foreground">{i.class_name}</span>
                  )}
                </Link>
                <span className="text-muted-foreground">{i.date}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isPending, isError, error } = useDashboardSummary();

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {forbidden
            ? "Your account does not have access to the dashboard figures. Use the menu to open the sections you can manage."
            : "Could not load the dashboard. Please try again."}
        </p>
      </div>
    );
  }

  const { counts, attendance_today: att } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{data.date}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active students" value={counts.students} />
        <Stat label="Active teachers" value={counts.teachers} />
        <Stat label="Active classes" value={counts.classes} />
        <Stat label="Attendance marked today" value={att.marked} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Present today" value={att.present} />
        <Stat label="Absent today" value={att.absent} />
        <Stat label="Late today" value={att.late} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingList
          title="Upcoming exams"
          empty="No upcoming exams."
          items={data.upcoming_exams.map((e) => ({
            id: e.id,
            title: e.title,
            date: e.exam_date,
            class_name: e.class_name,
            href: `/exams/${e.id}`,
          }))}
        />
        <UpcomingList
          title="Assignments due soon"
          empty="No assignments due."
          items={data.upcoming_assignments.map((a) => ({
            id: a.id,
            title: a.title,
            date: a.due_date,
            class_name: a.class_name,
            href: `/assignments/${a.id}`,
          }))}
        />
      </div>
    </div>
  );
}
