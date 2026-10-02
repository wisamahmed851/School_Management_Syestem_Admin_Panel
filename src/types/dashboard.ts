// Matches GET /admin/dashboard/summary (dashboard.service.ts)

export interface DashboardSummary {
  date: string;
  counts: { students: number; teachers: number; classes: number };
  attendance_today: { present: number; absent: number; late: number; marked: number };
  upcoming_exams: { id: number; title: string; exam_date: string; class_name: string | null }[];
  upcoming_assignments: { id: number; title: string; due_date: string; class_name: string | null }[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}
