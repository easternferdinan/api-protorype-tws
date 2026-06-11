import { Timestamp } from "firebase-admin/firestore";
import { firestore, messaging } from "../configs/firebase.js";
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
};
