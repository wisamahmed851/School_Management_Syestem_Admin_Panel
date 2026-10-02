"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/lib/auth/auth-store";
import { useProfile } from "@/hooks/use-profile";
import { useRouteActions } from "@/hooks/use-sidebar";
import { uploadUrl } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = useAuthStore((s) => s.admin);
  const { data: profile } = useProfile();

  // UX only: the backend still rejects direct calls. Stops a page the menu does not offer
  // from looping on 403 skeletons. /profile is not a menu leaf and is open to every admin.
  const segment = `/${usePathname().split("/")[1] ?? ""}`;
  const { hasAccess, isPending: menuPending } = useRouteActions(segment);
  const forbidden = !menuPending && !hasAccess && segment !== "/profile";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed-width sidebar */}
      <Sidebar />

      {/* Right column: header + page content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header adminName={admin?.name} adminAvatar={uploadUrl(profile?.image)} />

        <main className="flex-1 overflow-y-auto p-6">
          {forbidden ? (
            <div role="alert" className="mx-auto mt-16 max-w-md rounded-xl border bg-card p-6 text-center text-card-foreground">
              <h1 className="text-lg font-semibold">No access</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account does not have permission to open this page. Ask a super admin to grant it.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
