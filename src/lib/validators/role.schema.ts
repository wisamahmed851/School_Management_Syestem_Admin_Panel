import { z } from "zod";

const guardEnum = z.enum(["admin", "user"], {
  errorMap: () => ({ message: 'Guard must be "admin" or "user"' }),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  guard: guardEnum,
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  guard: guardEnum.optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
