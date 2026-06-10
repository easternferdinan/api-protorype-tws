import { auth } from "../configs/firebase.js";
import { customersRepository } from "../repositories/customers.repository.js";
import type {
  UpdateCustomerSchemaType,
  UpdatePasswordSchemaType,
} from "../schemas/customer.schema.js";

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
};
