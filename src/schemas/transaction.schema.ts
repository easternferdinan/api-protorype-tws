import { z } from "zod";

export const createTransactionSchema = z.object({
  layanan: z.string().min(1),
});

export type CreateTransactionSchemaType = z.infer<
  typeof createTransactionSchema
>;

export const adminCreateTransactionSchema = z.object({
  email: z.string().min(1),
  layanan: z.string().min(1),
  status: z.string().optional(),
  beratCucian: z.number().nonnegative(),
  totalBiaya: z.number().nonnegative(),
});

export type AdminCreateTransactionSchemaType = z.infer<
  typeof adminCreateTransactionSchema
>;

export const adminUpdateTransactionSchema = z.object({
  layanan: z.string().min(1).optional(),
  status: z.string().optional(),
  beratCucian: z.number().nonnegative().optional(),
  totalBiaya: z.number().nonnegative().optional(),
  tanggalSelesai: z.string().optional(),
});

export type AdminUpdateTransactionSchemaType = z.infer<
  typeof adminUpdateTransactionSchema
>;

export const customerUpdateTransactionSchema = z.object({
  paymentProofUrl: z.string().optional(),
  status: z.string().optional(),
});

export type CustomerUpdateTransactionSchemaType = z.infer<
  typeof customerUpdateTransactionSchema
>;
