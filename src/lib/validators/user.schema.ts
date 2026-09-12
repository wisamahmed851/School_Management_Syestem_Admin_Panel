import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role_id: z.coerce.number({ invalid_type_error: "Role is required" }).min(1, "Role is required"),
  // image handled separately via ImageUpload (File | null)
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
