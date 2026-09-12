import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

// All known status values across resources
type Status =
  // Generic
  | "active"
  | "inactive"
  // Attendance
  | "present"
  | "absent"
  | "late"
  // Assignments
  | "pending"
  | "submitted"
  | "graded"
  // Exams / results
  | "pass"
  | "fail"
  // Fallback
  | string;

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  // Generic
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  // Attendance
  present: {
    label: "Present",
    className: "bg-success/10 text-success border-success/20",
  },
  absent: {
    label: "Absent",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  late: {
    label: "Late",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  // Assignments
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  submitted: {
    label: "Submitted",
    className: "bg-accent text-accent-foreground border-accent",
  },
  graded: {
    label: "Graded",
    className: "bg-success/10 text-success border-success/20",
  },
  // Exams / results
  pass: {
    label: "Pass",
    className: "bg-success/10 text-success border-success/20",
  },
  fail: {
    label: "Fail",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const config = statusConfig[key] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
