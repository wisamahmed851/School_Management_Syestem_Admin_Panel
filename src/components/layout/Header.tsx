import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface HeaderProps {
  adminName?: string;
  adminAvatar?: string;
}

export default function Header({ adminName, adminAvatar }: HeaderProps) {
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

      {/* Right slot — admin name + avatar */}
      <div className="flex items-center gap-3">
        {adminName && (
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {adminName}
          </span>
        )}
        <Avatar size="sm">
          {adminAvatar && (
            <AvatarImage src={adminAvatar} alt={adminName ?? "Admin"} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
