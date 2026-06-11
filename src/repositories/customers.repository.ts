import { firestore } from "../configs/firebase.js";

export interface Customer {
  uid: string;
  email: string;
  nama: string;
  nomorTelepon: string;
  alamat: string;
  fcmTokens?: string[];
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

  async update(uid: string, data: Record<string, unknown>): Promise<void> {
    await firestore.collection("customers").doc(uid).set(data, { merge: true });
  },

  async listAll(): Promise<Customer[]> {
    const snapshot = await firestore
      .collection("customers")
      .orderBy("nama")
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      return { uid: doc.id, ...doc.data() } as Customer;
    });
  },

  async getByEmail(email: string): Promise<Customer | null> {
    const snapshot = await firestore
      .collection("customers")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0]!;
    return { uid: doc.id, ...doc.data() } as Customer;
  },

  async delete(uid: string): Promise<void> {
    await firestore.collection("customers").doc(uid).delete();
  },
};
