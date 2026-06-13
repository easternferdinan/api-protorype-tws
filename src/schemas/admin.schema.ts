import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const updateAdminSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(1).optional(),
});

export const fcmTokenSchema = z.object({
  fcmToken: z.string().min(1),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type UpdateAdminSchemaType = z.infer<typeof updateAdminSchema>;
export type FcmTokenSchemaType = z.infer<typeof fcmTokenSchema>;
