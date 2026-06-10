import { z } from "zod";

export const updateCustomerSchema = z.object({
  nama: z.string().min(1).optional(),
  nomorTelepon: z.string().min(10).optional(),
  alamat: z.string().min(1).optional(),
});

export type UpdateCustomerSchemaType = z.infer<typeof updateCustomerSchema>;

export const updatePasswordSchema = z.object({
  newPassword: z.string().min(8),
});

export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
