import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address format"),
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const userIdParamSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type UserIdParamDto = z.infer<typeof userIdParamSchema>;
