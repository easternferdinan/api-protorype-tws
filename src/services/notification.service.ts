import { Timestamp } from "firebase-admin/firestore";
import { firestore, messaging } from "../configs/firebase.js";
import { adminsRepository } from "../repositories/admins.repository.js";
import { customersRepository } from "../repositories/customers.repository.js";

function notificationTitle(event: string): string {
  switch (event) {
    case "Menunggu Pembayaran":
      return "Cucian Menunggu Pembayaran!";
    case "Pengantaran":
      return "Cucian Dalam Pengantaran!";
    case "Selesai":
      return "Cucian Anda Telah Selesai!";
    default:
      return "Status Cucian Diperbarui";
  }
}

function notificationSubtitle(event: string, idTransaksi: string): string {
  switch (event) {
    case "Menunggu Pembayaran":
      return "Silakan lakukan pembayaran dan upload bukti.";
    case "Pengantaran":
      return `Pembayaran untuk ${idTransaksi} telah dikonfirmasi. Cucian sedang diantar.`;
    case "Selesai":
      return "Terima kasih telah memilih Tjapang Laundry.";
    default:
      return `Status transaksi ${idTransaksi} telah diperbarui.`;
  }
}

export const notificationService = {
  async send(data: {
    targetEmail: string;
    idTransaksi: string;
    event: string;
  }) {
    console.log("Sending notification", data);
    const title = notificationTitle(data.event);
    const subtitle = notificationSubtitle(data.event, data.idTransaksi);

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
          type: "status_update",
        },
      });
      console.log(notif.failureCount, "tokens failed to send");
      console.log(notif.responses);
    } catch (error) {
      console.error("FCM send failed:", error);
    }
  },

  async sendToAdmin(event: string, idTransaksi: string) {
    const admin = await adminsRepository.getFirst();
    if (!admin) return;

    const title =
      event === "Menunggu Konfirmasi"
        ? "Bukti Pembayaran Baru!"
        : "Pesanan Baru!";
    const body =
      event === "Menunggu Konfirmasi"
        ? `Transaksi ${idTransaksi} menunggu konfirmasi pembayaran.`
        : `Ada pesanan baru: ${idTransaksi}. Silakan cek aplikasi.`;

    await firestore.collection("notifications").add({
      date: Timestamp.now(),
      idTransaksi,
      isSeen: false,
      subtitle: body,
      target: "admin",
      title,
    });

    const tokens = admin.data.fcmTokens ?? [];
    if (tokens.length === 0) return;

    try {
      await messaging.sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: { idTransaksi, event, type: "status_update" },
      });
    } catch (error) {
      console.error("FCM send to admin failed:", error);
    }
  },
};
