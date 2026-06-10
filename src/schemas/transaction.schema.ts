import { z } from "zod";

export const createTransactionSchema = z.object({
  layanan: z.string().min(1),
});

export type CreateTransactionSchemaType = z.infer<
  typeof createTransactionSchema
>;
