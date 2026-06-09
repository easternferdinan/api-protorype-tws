import { auth } from "../configs/firebase.js";
import { customersRepository } from "../repositories/customers.repository.js";

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
      await customersRepository.create({
        uid: userRecord.uid,
        email: data.email,
        nama: data.nama,
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
