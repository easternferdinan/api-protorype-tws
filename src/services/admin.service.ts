import { adminsRepository } from "../repositories/admins.repository.js";
import type {
  LoginSchemaType,
  UpdateAdminSchemaType,
} from "../schemas/admin.schema.js";

export const adminService = {
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

    await adminsRepository.updateById(admin.id, data);

    return { email: data.email ?? admin.data.email };
  },
};
