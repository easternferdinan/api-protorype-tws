import { auth, firestore } from "../configs/firebase.js";

import type {
  LoginSchemaType,
  RegisterSchemaType,
} from "../schemas/auth.schema.js";

export const authService = {
  async login(_data: LoginSchemaType) {
    throw new Error("Not implemented");
  },

  async register(data: RegisterSchemaType) {
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.nama,
    });

    try {
      await firestore
        .collection("customers")
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          email: data.email,
          name: data.nama,
          nomorTelepon: data.nomorTelepon,
          alamat: data.alamat,
        });

      return { uid: userRecord.uid };
    } catch (error) {
      await auth.deleteUser(userRecord.uid).catch(console.error);
      throw error;
    }
  },
};
