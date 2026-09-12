import { z } from "zod";

// NOTE: The API docs (section 1.3) do not specify a minimum length for
// newPassword. An 8-character minimum is applied here as a reasonable default.
// If the backend enforces a different minimum, update this value to match.
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
