import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  role_id: z.coerce.number().optional(),
  // image handled separately via ImageUpload component (File | null)
});

export const updateAdminSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  password: z.string().optional(),
  role_id: z.coerce.number().optional(),
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;
export type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;
