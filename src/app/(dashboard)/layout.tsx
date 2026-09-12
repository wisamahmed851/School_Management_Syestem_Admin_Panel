"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/lib/auth/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = useAuthStore((s) => s.admin);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed-width sidebar */}
      <Sidebar />

      {/* Right column: header + page content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header adminName={admin?.name} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
