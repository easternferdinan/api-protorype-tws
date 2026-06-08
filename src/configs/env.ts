// src/config/env.ts

import "dotenv/config";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 3000),
    FIREBASE_API_KEY: getEnv("FIREBASE_API_KEY"),
    FIREBASE_AUTH_DOMAIN: getEnv("FIREBASE_AUTH_DOMAIN"),
    FIREBASE_PROJECT_ID: getEnv("FIREBASE_PROJECT_ID"),
    FIREBASE_STORAGE_BUCKET: getEnv("FIREBASE_STORAGE_BUCKET"),
    FIREBASE_MESSAGING_SENDER_ID: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
    FIREBASE_APP_ID: getEnv("FIREBASE_APP_ID"),
    FIREBASE_MEASUREMENT_ID: getEnv("FIREBASE_MEASUREMENT_ID"),
};