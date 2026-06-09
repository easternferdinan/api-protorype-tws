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
};
