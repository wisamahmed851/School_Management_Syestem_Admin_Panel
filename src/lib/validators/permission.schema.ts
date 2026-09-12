import { z } from "zod";

const guardEnum = z.enum(["admin", "user"], {
  errorMap: () => ({ message: 'Guard must be "admin" or "user"' }),
});

export const createPermissionSchema = z.object({
  module: z.string().min(1, "Module is required"),
  action: z.string().min(1, "Action is required"),
  name: z.string().min(1, "Name is required"),
  guard: guardEnum,
});

export const updatePermissionSchema = z.object({
  module: z.string().min(1, "Module is required").optional(),
  action: z.string().min(1, "Action is required").optional(),
  name: z.string().min(1, "Name is required").optional(),
  guard: guardEnum.optional(),
});

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionFormValues = z.infer<typeof updatePermissionSchema>;
