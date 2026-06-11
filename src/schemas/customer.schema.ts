import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z.string().min(1),
  nama: z.string().min(1),
  nomorTelepon: z.string().min(1),
  alamat: z.string().min(1),
});

export type CreateCustomerSchemaType = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  nama: z.string().min(1).optional(),
  nomorTelepon: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
});

export type UpdateCustomerSchemaType = z.infer<typeof updateCustomerSchema>;

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(8),
});

export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

export const updateFcmTokenSchema = z.object({
  fcmToken: z.string().min(1),
});

export type UpdateFcmTokenSchemaType = z.infer<typeof updateFcmTokenSchema>;
