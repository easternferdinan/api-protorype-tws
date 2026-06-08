import type { LoginSchemaType, RegisterSchemaType } from "../schemas/auth.schema.js";

export const authService = {
    async login(data: LoginSchemaType) {
        throw new Error("Not implemented. Data: " + JSON.stringify(data));
    },

    async register(data: RegisterSchemaType) {
        throw new Error("Not implemented. Data: " + JSON.stringify(data));
    }
}