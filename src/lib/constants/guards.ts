/** The two fixed guard values used throughout the system. */
export const GUARD_OPTIONS = [
  { value: "admin", label: "admin" },
  { value: "user", label: "user" },
] as const;

export type GuardValue = "admin" | "user";
