import { FieldValue } from "firebase-admin/firestore";
import {
  type Admin,
  adminsRepository,
} from "../repositories/admins.repository.js";
import type {
  LoginSchemaType,
  UpdateAdminSchemaType,
} from "../schemas/admin.schema.js";

export const adminService = {
  async getFirst() {
    return adminsRepository.getFirst();
  },

  async updateFcmToken(docId: string, fcmToken: string) {
    await adminsRepository.updateById(docId, {
      fcmTokens: FieldValue.arrayUnion(fcmToken) as unknown as string[],
    });
  },

  async login(data: LoginSchemaType) {
    const admin = await adminsRepository.getByEmail(data.email);

    if (!admin || admin.password !== data.password) {
      throw Object.assign(new Error("Invalid email or password"), {
        status: 401,
      });
    }

    return { email: admin.email };
  },

  async update(data: UpdateAdminSchemaType) {
    if (!data.email && !data.password) {
      throw Object.assign(new Error("Nothing to update"), { status: 400 });
    }

    const admin = await adminsRepository.getFirst();
    if (!admin) {
      throw Object.assign(new Error("Admin not found"), { status: 404 });
    }

    const updateData: Partial<Admin> = {};
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    await adminsRepository.updateById(admin.id, updateData);

    return { email: updateData.email ?? admin.data.email };
  },
};
