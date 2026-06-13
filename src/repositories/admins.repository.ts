import { firestore } from "../configs/firebase.js";

export interface Admin {
  email: string;
  password: string;
  fcmTokens?: string[];
}

const COLLECTION = "admins";

export const adminsRepository = {
  async getByEmail(email: string): Promise<Admin | null> {
    const snapshot = await firestore
      .collection(COLLECTION)
      .where("email", "==", email)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return doc!.data() as Admin;
  },

  async getDocIdByEmail(email: string): Promise<string | null> {
    const snapshot = await firestore
      .collection(COLLECTION)
      .where("email", "==", email)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0]!.id;
  },

  async getFirst(): Promise<{ id: string; data: Admin } | null> {
    const snapshot = await firestore.collection(COLLECTION).limit(1).get();
    console.log(snapshot.docs);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc!.id, data: doc!.data() as Admin };
  },

  async updateById(docId: string, data: Partial<Admin>): Promise<void> {
    await firestore.collection(COLLECTION).doc(docId).set(data, {
      merge: true,
    });
  },
};
