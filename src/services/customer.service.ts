import { auth, firestore } from "../configs/firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import { customersRepository } from "../repositories/customers.repository.js";
import type {
  UpdateCustomerSchemaType,
  UpdatePasswordSchemaType,
  UpdateFcmTokenSchemaType,
} from "../schemas/customer.schema.js";
import type { Customer } from "../repositories/customers.repository.js";

export const customerService = {
  async getProfile(uid: string) {
    const customer = await customersRepository.get(uid);

    if (!customer) {
      const error = new Error("Customer not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return customer;
  },

  async updateProfile(uid: string, data: UpdateCustomerSchemaType) {
    await customersRepository.update(uid, data);
    const customer = await customersRepository.get(uid);
    return customer;
  },

  async updatePassword(uid: string, data: UpdatePasswordSchemaType) {
    await auth.updateUser(uid, { password: data.newPassword });
  },

  async updateFcmToken(uid: string, fcmToken: string) {
    await customersRepository.update(uid, {
      fcmTokens: FieldValue.arrayUnion(fcmToken),
    });
  },

  // --- Admin endpoints ---

  async listAll() {
    return customersRepository.listAll();
  },

  async create(data: Omit<Customer, "uid">) {
    const uid = data.email;
    const customer: Customer = { uid, ...data };
    await customersRepository.create(customer);
    return customer;
  },

  async update(uid: string, data: Partial<Omit<Customer, "uid">>) {
    await customersRepository.update(uid, data);
    return customersRepository.get(uid);
  },

  async delete(uid: string) {
    await customersRepository.delete(uid);
  },
};
