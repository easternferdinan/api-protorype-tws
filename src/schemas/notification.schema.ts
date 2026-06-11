import { z } from "zod";

export const sendNotificationSchema = z.object({
  targetEmail: z.string().min(1),
  idTransaksi: z.string().min(1),
  event: z.enum(["Menunggu Pembayaran", "Selesai"]),
});

export type SendNotificationSchemaType = z.infer<typeof sendNotificationSchema>;
