import { z } from "zod";

export const sendNotificationSchema = z.object({
  targetEmail: z.string().min(1),
  idTransaksi: z.string().min(1),
  event: z.enum([
    "Menunggu Pembayaran",
    "Selesai",
    "Diproses",
    "Menunggu Konfirmasi",
    "Pengantaran",
    "Penjemputan",
    "status_update",
  ]),
});

export type SendNotificationSchemaType = z.infer<typeof sendNotificationSchema>;
