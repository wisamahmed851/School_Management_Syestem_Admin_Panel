"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Class-subject mappings are managed from each class's own page:
 *   /classes/<id>/subjects
 *
 * This route redirects there so any direct link to /class-subjects lands
 * somewhere useful rather than a blank page.
 */
export default function ClassSubjectsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/classes");
  }, [router]);

  return null;
}
