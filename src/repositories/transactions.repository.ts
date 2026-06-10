import type { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../configs/firebase.js";

export interface Transaction {
  transactionId: string;
  customerUid: string;
  layanan: string;
  status: string;
  beratCucian: number;
  totalBiaya: number;
  tanggalDiterima: Timestamp;
  tanggalSelesai: Timestamp | null;
}

export const transactionsRepository = {
  async create(data: Transaction): Promise<void> {
    await firestore
      .collection("transactions")
      .doc(data.transactionId)
      .set(data);
  },

  async listByCustomerUid(customerUid: string): Promise<Transaction[]> {
    const snapshot = await firestore
      .collection("transactions")
      .where("customerUid", "==", customerUid)
      .orderBy("tanggalDiterima", "desc")
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      return { ...doc.data() } as Transaction;
    });
  },

  async getLatest(): Promise<Transaction | null> {
    const snapshot = await firestore
      .collection("transactions")
      .orderBy("tanggalDiterima", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0]!;
    return { ...doc.data() } as Transaction;
  },
};
