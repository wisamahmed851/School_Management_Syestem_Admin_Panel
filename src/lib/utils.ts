export { cn } from "cn"

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Public URL of a file the backend stored in /uploads (the API returns the bare filename). */
export function uploadUrl(filename: string | null | undefined): string | undefined {
  return filename ? `${API_URL}/uploads/${filename}` : undefined;
}

/** Drop empty-string fields so optional API fields are omitted instead of sent as "" (which the backend rejects). */
export function omitEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== ""),
  ) as Partial<T>;
}
