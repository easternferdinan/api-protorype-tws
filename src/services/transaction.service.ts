import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../configs/firebase.js";
import { transactionsRepository } from "../repositories/transactions.repository.js";
import type { Transaction } from "../repositories/transactions.repository.js";
import { customersRepository } from "../repositories/customers.repository.js";
import { notificationService } from "./notification.service.js";

function generateTransactionId(lastTxId: string | null, prefix: string = "D"): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const todayKey = `${day}${month}${year}`;

  if (lastTxId?.startsWith(prefix) && lastTxId.substring(1, 9) === todayKey) {
    const seq = parseInt(lastTxId.substring(9, 12), 10) + 1;
    return `${prefix}${todayKey}${String(seq).padStart(3, "0")}`;
  }

  return `${prefix}${todayKey}001`;
}

export const transactionService = {
  async list(customerUid: string) {
    const transactions =
      await transactionsRepository.listByCustomerUid(customerUid);
    return transactions.map((tx) => ({
      ...tx,
      tanggalDiterima: tx.tanggalDiterima.toDate().toISOString(),
      tanggalSelesai: tx.tanggalSelesai?.toDate().toISOString() ?? null,
    }));
  },

  async create(customerUid: string, layanan: string) {
    const latest = await transactionsRepository.getLatest();
    const transactionId = generateTransactionId(latest?.transactionId ?? null);
    const now = Timestamp.now();

    const customer = await customersRepository.get(customerUid);
    const email = customer?.email;

    const transaction = {
      transactionId,
      customerUid,
      ...(email ? { email } : {}),
      layanan,
      status: "Penjemputan",
      beratCucian: 0,
      totalBiaya: 0,
      tanggalDiterima: now,
      tanggalSelesai: null,
    } as Transaction;

    await transactionsRepository.create(transaction);

    notificationService.sendToAdmin("Penjemputan", transactionId);

    return {
      ...transaction,
      tanggalDiterima: now.toDate().toISOString(),
      tanggalSelesai: null,
    };
  },

  async listAllTransactions() {
    const transactions = await transactionsRepository.listAll();

    return Promise.all(
      transactions.map(async (tx) => {
        const email =
          tx.email ??
          (tx.customerUid
            ? (await customersRepository.get(tx.customerUid))?.email ?? null
            : null);

        return {
          ...tx,
          email,
          tanggalDiterima: tx.tanggalDiterima.toDate().toISOString(),
          tanggalSelesai: tx.tanggalSelesai?.toDate().toISOString() ?? null,
        };
      }),
    );
  },

  // --- Customer update (e.g., store payment proof URL) ---

  async update(id: string, uid: string, data: Record<string, unknown>) {
    const doc = await firestore
      .collection("transactions")
      .doc(id)
      .get();
    if (!doc.exists) {
      const error = new Error("Transaction not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    const tx = { transactionId: doc.id, ...doc.data() } as Transaction;
    if (tx.customerUid !== uid) {
      const error = new Error("Forbidden");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    await transactionsRepository.update(id, data);

    const updated = await firestore
      .collection("transactions")
      .doc(id)
      .get();
    const result = { transactionId: updated.id, ...updated.data() } as Transaction;
    return {
      ...result,
      tanggalDiterima: result.tanggalDiterima.toDate().toISOString(),
      tanggalSelesai: result.tanggalSelesai?.toDate().toISOString() ?? null,
    };
  },

  // --- Admin transaction endpoints ---

  async adminCreate(data: {
    email: string;
    layanan: string;
    status?: string;
    beratCucian: number;
    totalBiaya: number;
  }) {
    const latest = await transactionsRepository.getLatestByPrefix("L");
    const transactionId = generateTransactionId(
      latest?.transactionId ?? null,
      "L",
    );
    const now = Timestamp.now();

    const transaction = {
      transactionId,
      email: data.email,
      layanan: data.layanan,
      status: data.status ?? "Diproses",
      beratCucian: data.beratCucian,
      totalBiaya: data.totalBiaya,
      tanggalDiterima: now,
      tanggalSelesai: null,
    } as Transaction;

    await transactionsRepository.create(transaction);

    return {
      ...transaction,
      tanggalDiterima: now.toDate().toISOString(),
      tanggalSelesai: null,
    };
  },

  async adminUpdate(id: string, data: Record<string, unknown>) {
    const sanitized = { ...data };
    if (typeof sanitized.tanggalSelesai === "string") {
      sanitized.tanggalSelesai = Timestamp.fromDate(
        new Date(sanitized.tanggalSelesai as string),
      );
    }
    if (typeof sanitized.tanggalDiterima === "string") {
      sanitized.tanggalDiterima = Timestamp.fromDate(
        new Date(sanitized.tanggalDiterima as string),
      );
    }
    await transactionsRepository.update(id, sanitized);

    const doc = await firestore
      .collection("transactions")
      .doc(id)
      .get();
    if (!doc.exists) {
      const error = new Error("Transaction not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    const tx = { transactionId: doc.id, ...doc.data() } as Transaction;

    return {
      ...tx,
      tanggalDiterima: tx.tanggalDiterima.toDate().toISOString(),
      tanggalSelesai: tx.tanggalSelesai?.toDate().toISOString() ?? null,
    };
  },

  async adminDelete(id: string) {
    await transactionsRepository.delete(id);
  },

  // --- Payment proof ---

  async getProof(transactionId: string): Promise<string | null> {
    const url =
      `https://res.cloudinary.com/drorlkqbp/image/upload/v1767860336/laundry-app-mobpro/${transactionId}.jpg`;
    const response = await fetch(url, { method: "HEAD" });
    return response.ok ? url : null;
  },
};
