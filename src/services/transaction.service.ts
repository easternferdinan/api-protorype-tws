import { Timestamp } from "firebase-admin/firestore";
import { transactionsRepository } from "../repositories/transactions.repository.js";
import type { Transaction } from "../repositories/transactions.repository.js";
import { customersRepository } from "../repositories/customers.repository.js";

function generateTransactionId(lastTxId: string | null): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const todayKey = `${day}${month}${year}`;

  if (lastTxId?.startsWith("D") && lastTxId.substring(1, 9) === todayKey) {
    const seq = parseInt(lastTxId.substring(9, 12), 10) + 1;
    return `D${todayKey}${String(seq).padStart(3, "0")}`;
  }

  return `D${todayKey}001`;
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
};
