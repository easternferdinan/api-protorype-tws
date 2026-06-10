import { firestore } from "../configs/firebase.js";

export interface Customer {
  uid: string;
  email: string;
  nama: string;
  nomorTelepon: string;
  alamat: string;
}

export const customersRepository = {
  async create(data: Customer): Promise<void> {
    await firestore.collection("customers").doc(data.uid).set(data);
  },

  async get(uid: string): Promise<Customer | null> {
    const doc = await firestore.collection("customers").doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as Customer;
  },

  async update(uid: string, data: Partial<Customer>): Promise<void> {
    await firestore.collection("customers").doc(uid).set(data, { merge: true });
  },
};
