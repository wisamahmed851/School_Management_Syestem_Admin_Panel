"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useLogout } from "@/hooks/use-logout";

export default function ProfilePage() {
  const { data: profile, isPending } = useProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          ) : profile ? (
            <div className="space-y-4">
              {/* Avatar + name + email */}
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  {profile.image && (
                    <AvatarImage
                      src={profile.image}
                      alt={profile.name}
                    />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {profile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-muted-foreground">ID</dt>
                  <dd className="text-foreground">{profile.id}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-muted-foreground">
                    Status
                  </dt>
                  <dd className="text-foreground">
                    {profile.status === 1 ? "Active" : "Inactive"}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-muted-foreground">
                    Created
                  </dt>
                  <dd className="text-foreground">{profile.created_at}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/change-password">Change Password</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoggingOut}
            onClick={() => logout()}
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
