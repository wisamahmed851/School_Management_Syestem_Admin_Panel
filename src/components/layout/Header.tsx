"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { useLogout } from "@/hooks/use-logout";

interface HeaderProps {
  adminName?: string;
  adminAvatar?: string;
}

export default function Header({ adminName, adminAvatar }: HeaderProps) {
  const { mutate: logout } = useLogout();

  const initials = adminName
    ? adminName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Left slot — breadcrumbs */}
      <div className="flex items-center gap-2">
        <Breadcrumbs />
      </div>

      {/* Right slot — avatar dropdown */}
      <div className="flex items-center gap-3">
        {adminName && (
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {adminName}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar size="sm">
              {adminAvatar && (
                <AvatarImage src={adminAvatar} alt={adminName ?? "Admin"} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuPositioner alignment="end" side="bottom" sideOffset={6}>
              <DropdownMenuContent>
                <DropdownMenuItem render={<Link href="/profile" />}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </header>
  );
}
