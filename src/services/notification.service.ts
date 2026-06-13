import { Timestamp } from "firebase-admin/firestore";
import { firestore, messaging } from "../configs/firebase.js";
import { adminsRepository } from "../repositories/admins.repository.js";
import { customersRepository } from "../repositories/customers.repository.js";

export const notificationService = {
  async send(data: {
    targetEmail: string;
    idTransaksi: string;
    event: "Menunggu Pembayaran" | "Selesai";
  }) {
    console.log("Sending notification", data);
    const title =
      data.event === "Menunggu Pembayaran"
        ? "Cucian Menunggu Pembayaran!"
        : "Cucian Anda Telah Selesai!";

    const subtitle =
      data.event === "Menunggu Pembayaran"
        ? "Silakan lakukan pembayaran dan upload bukti."
        : "Terima kasih telah memilih Tjapang Laundry.";

    await firestore.collection("notifications").add({
      date: Timestamp.now(),
      idTransaksi: data.idTransaksi,
      isSeen: false,
      subtitle,
      target: data.targetEmail,
      title,
    });

    const customer = await customersRepository.getByEmail(data.targetEmail);
    console.log("customer token", customer?.fcmTokens);
    const tokens = customer?.fcmTokens ?? [];

    if (tokens.length === 0) return;

    try {
      const notif = await messaging.sendEachForMulticast({
        tokens,
        notification: { title, body: subtitle },
        data: {
          idTransaksi: data.idTransaksi,
          event: data.event,
        },
      });
      console.log(notif.failureCount, "tokens failed to send");
      console.log(notif.responses);
    } catch (error) {
      console.error("FCM send failed:", error);
    }
  },

  async sendToAdmin(
    event: "Penjemputan",
    idTransaksi: string,
  ) {
    const admin = await adminsRepository.getFirst();
    if (!admin) return;

    const title = "Pesanan Baru!";
    const subtitle = `Transaksi ${idTransaksi} telah dibuat.`;
    const body = `Ada pesanan baru: ${idTransaksi}. Silakan cek aplikasi.`;

    await firestore.collection("notifications").add({
      date: Timestamp.now(),
      idTransaksi,
      isSeen: false,
      subtitle,
      target: "admin",
      title,
    });

    const tokens = admin.data.fcmTokens ?? [];
    if (tokens.length === 0) return;

    try {
      await messaging.sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: { idTransaksi, event },
      });
    } catch (error) {
      console.error("FCM send to admin failed:", error);
    }
  },
};
